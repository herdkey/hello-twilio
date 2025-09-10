import '@twilio-labs/serverless-runtime-types';

import * as Twilio from 'twilio';

import { logger } from '@src/shared/logger';

import type {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
  ServerlessEventObject,
} from '@twilio-labs/serverless-runtime-types/types';

type MyEvent = {
  Body?: string;
};

// If you want to use environment variables, you will need to type them like
// this and add them to the Context in the function signature as
// Context<MyContext> as you see below.
type MyContext = {
  GREETING?: string;
};

export const handler: ServerlessFunctionSignature = (
  context: Context<MyContext>,
  event: ServerlessEventObject<MyEvent>,
  callback: ServerlessCallback,
) => {
  logger.info(`GREETING: ${context.GREETING}`);
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say(
    `${context.GREETING ? context.GREETING : 'Hello'} ${
      event.Body ? event.Body : 'World'
    }!`,
  );
  callback(null, twiml);
};
