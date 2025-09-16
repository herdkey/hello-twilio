import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

import { getJokeById } from '@shared/knock-knock/jokes';
import { stepRunner } from '@shared/knock-knock/step-machine';
import { logger } from '@shared/utils/logger';
import { withParams } from '@shared/utils/qsUtils';

import type { Step } from '@shared/knock-knock/step-machine';
import type { EnvContext, RequestHeaders } from '@shared/twilio';
import type {
  Context,
  ServerlessCallback,
  ServerlessEventObject,
  ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types';

interface KnockEvent {
  step?: Step;
  attempt?: string | number;
  j?: string; // joke id (persisted across turns)
  Digits?: string; // keypad
  SpeechResult?: string; // ASR transcript
  Confidence?: string | number; // 0..1
  noinput?: string;
}

interface TwilioContext extends EnvContext {
  URL_PATH?: string; // optional override for action URL
}

// noinspection JSUnusedGlobalSymbols
export const handler: ServerlessFunctionSignature<
  Context<TwilioContext>,
  ServerlessEventObject<KnockEvent, RequestHeaders>
> = (
  context: TwilioContext,
  event: ServerlessEventObject<KnockEvent, RequestHeaders>,
  callback: ServerlessCallback,
) => {
  logger.debug(context, 'handler context');
  logger.debug(event, 'handler event');

  const twiml = new VoiceResponse();
  const basePath = context.URL_PATH ?? '/knock-knock';

  stepRunner({
    step: event.step ?? 'intro',
    twiml,
    knockUrl: withParams(basePath),
    joke: getJokeById(event.j),
    attempt: Number(event.attempt ?? 0),
    digits: event.Digits ?? '',
    speech: event.SpeechResult ?? '',
    conf: event.Confidence !== undefined ? Number(event.Confidence) : null,
    noinput: event.noinput === '1',
  });
  return callback(null, twiml);
};
