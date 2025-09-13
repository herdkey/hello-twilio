import { CFG } from '@shared/knock-knock/config';

import type { WithParams } from '@shared/utils/qsUtils';
import type VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

export const say = (twiml: VoiceResponse, text: string) =>
  twiml.say({ voice: CFG.voice }, text);

/**
 * Prompts the user with a message using Twilio's `<Gather>` verb,
 * allowing input via speech or DTMF (key presses). If no input is detected,
 * the user is redirected to a fallback URL for further interaction.
 *
 * @param {VoiceResponse} twiml - The Twilio VoiceResponse instance to add the <Gather> and <Redirect> verbs to.
 * @param {string} prompt - The message to be played to the user. It will be spoken using the configured voice.
 * @param {string} actionUrl - The URL to which the input from the user will be sent. If no input is detected,
 *                             the user will be redirected to this URL with an added `noinput=1` query parameter.
 */
type AskWithFallbackParams = {
  twiml: VoiceResponse;
  prompt: string;
  actionUrl: string;
};

export const askWithFallback = ({
  twiml,
  prompt,
  actionUrl,
}: AskWithFallbackParams) => {
  const gather = twiml.gather({
    input: ['speech', 'dtmf'],
    numDigits: 1, // press 9 to end call
    speechTimeout: 'auto',
    language: CFG.lang,
    action: actionUrl,
    method: 'POST',
    profanityFilter: false,
  });
  gather.say({ voice: CFG.voice }, prompt);
  // If no input, force a follow-up turn with noinput=1
  const sep = actionUrl.includes('?') ? '&' : '?';
  twiml.redirect({ method: 'POST' }, `${actionUrl}${sep}noinput=1`);
};

/**
 * Handles scenarios where no input is provided during a dialog flow.
 * This function ensures proper handling of configured attempts and provides responses accordingly.
 *
 * @param {VoiceResponse} twiml - Instance of Twilio's VoiceResponse class used to build voice responses.
 * @param {number} attempt - The current attempt count for handling user input.
 * @param {WithParams} knockUrl - A function that generates a URL with supplied parameters for retrying requests.
 * @param {Record<string, string | number | undefined>} params - A record containing key-value pairs of parameters passed to the knockUrl function.
 * @param {string} reprompt - The message to be played to the user in case of no input.
 * @param {string} finalMsg - The final message to be played to the user when maximum attempts are reached.
 */
type HandleNoInputParams = {
  twiml: VoiceResponse;
  attempt: number;
  knockUrl: WithParams;
  params: Record<string, string | number | undefined>;
  reprompt: string;
  finalMsg: string;
};

export const handleNoInput = ({
  twiml,
  attempt,
  knockUrl,
  params,
  reprompt,
  finalMsg,
}: HandleNoInputParams) => {
  if (attempt >= CFG.maxAttempts) {
    say(twiml, finalMsg);
    twiml.hangup();
    return;
  }
  askWithFallback({
    twiml,
    prompt: reprompt,
    actionUrl: knockUrl({ ...params, attempt: attempt + 1 }),
  });
};

export const endCall = (twiml: VoiceResponse, msg: string) => {
  say(twiml, msg);
  twiml.hangup();
};
