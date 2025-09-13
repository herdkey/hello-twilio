import _ from 'lodash';

import { CFG } from '@shared/knock-knock/config';
import {
  askWithFallback,
  endCall,
  handleNoInput,
  say,
} from '@shared/knock-knock/twiml-helpers';
import { approxIncludes } from '@shared/knock-knock/utils';

import type { Joke } from '@shared/knock-knock/jokes';
import type { WithParams } from '@shared/utils/qsUtils';
import type VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

export type Step = 'intro' | 'whos' | 'setupWho';

export const isWhosThere = (utterance: string) =>
  approxIncludes(utterance, "who's there", 2) ||
  approxIncludes(utterance, 'whos there', 2) ||
  approxIncludes(utterance, 'who is there', 2);

export const isSetupWho = (utterance: string, setup: string) =>
  approxIncludes(utterance, `${setup} who`, 2);

/**
 * Represents the context of a single step within a system or process that involves voice response,
 * interaction parameters, jokes, attempts, and input data.
 */
interface StepContext {
  /** An instance of a voice response object used for handling voice interactions. */
  twiml: VoiceResponse;
  /** The current step of the dialog flow. */
  step: Step;
  /** A URL with specific parameters for processing or interaction. */
  knockUrl: WithParams;
  /** An instance representing a joke or humorous content. */
  joke: Joke;
  /** The current attempt number within the step context. */
  attempt: number;
  /** The digits input or detected during the operation. */
  digits: string;
  /** The speech input or transcription generated in the step context. */
  speech: string;
  /** The confidence level of the operation or input, or null if unavailable. */
  conf: number | null;
  /** Whether the user has provided no input during the current turn. */
  noinput: boolean;
}

export const stepRunner = (ctx: StepContext) => {
  const { step, twiml, knockUrl, joke, attempt, digits, conf, noinput } = ctx;

  // Persist joke choice across turns

  // Intro is just the opener
  if (step === 'intro') {
    return askWithFallback({
      twiml,
      prompt: 'Knock knock.',
      // `You need to say: Who's there?`,
      actionUrl: knockUrl({ j: joke.id, step: 'whos', attempt: 1 }),
    });
  }

  // Unified step runner
  const spec = stepSpecs(joke)[step];

  // No-input flow
  if (noinput) {
    return handleNoInput({
      twiml,
      attempt,
      knockUrl,
      params: { j: joke.id, step },
      reprompt: spec.reprompt(ctx),
      finalMsg: spec.giveUpMsg(ctx),
    });
  }

  // DTMF control: skip
  if (digits === CFG.SKIP_KEY) {
    return endCall(twiml, spec.skipMsg(ctx));
  }

  // Speech validation
  if (spec.validate(ctx)) {
    if (conf !== null && conf < 0.5) {
      say(twiml, 'Got it!');
    }
    return spec.onSuccess(ctx);
  }

  // Wrong utterance -> reprompt or end
  if (attempt < CFG.maxAttempts) {
    return askWithFallback({
      twiml,
      prompt: spec.reprompt(ctx),
      actionUrl: knockUrl({ j: joke.id, step, attempt: attempt + 1 }),
    });
  }

  // Too many failed attempts -> give up
  return endCall(twiml, spec.giveUpMsg(ctx));
};

interface StepSpec {
  /** Initial prompt shown when entering this step (via askWithFallback) */
  prompt: (ctx: StepContext) => string;
  /** Reprompt used on wrong answer */
  reprompt: (ctx: StepContext) => string;
  /** Message when caller presses SKIP_KEY */
  skipMsg: (ctx: StepContext) => string;
  /** Final message after attempts exhausted (or noinput maxed) */
  giveUpMsg: (ctx: StepContext) => string;
  /** Validation for speech */
  validate: (ctx: StepContext) => boolean;
  /** What to do on success (may say things and transition to next step/end) */
  onSuccess: (ctx: StepContext) => void;
}

export const stepSpecs = (
  joke: Joke,
): Record<Exclude<Step, 'intro'>, StepSpec> => ({
  whos: {
    prompt: () => `You need to say: Who's there?`,
    reprompt: () => `Please say exactly: Who's there?`,
    skipMsg: () => `Okay, maybe later. Bye!`,
    giveUpMsg: () => `We'll stop here. Next time, start with: Who's there?`,
    validate: ({ speech }) => isWhosThere(speech),
    onSuccess: ({ twiml, knockUrl }) => {
      say(twiml, 'Knock knock accepted.');
      say(twiml, `${_.capitalize(joke.id)} joke coming up.`);
      say(twiml, `${joke.setup}.`);
      askWithFallback({
        twiml,
        prompt: `Now say: ${joke.setup} who?`,
        actionUrl: knockUrl({ j: joke.id, step: 'setupWho', attempt: 1 }),
      });
    },
  },
  setupWho: {
    prompt: () => `Say: ${joke.setup} who?`,
    reprompt: () => `Not quite. Please say: ${joke.setup} who?`,
    skipMsg: () => `No worries—catch you later!`,
    giveUpMsg: () => `Time's up! The punchline was: ${joke.punch}`,
    validate: ({ speech }) => isSetupWho(speech, joke.setup),
    onSuccess: ({ twiml, joke }) => {
      say(twiml, joke.punch);
      endCall(twiml, 'Thanks for playing. Goodbye!');
    },
  },
});
