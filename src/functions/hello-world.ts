import '@twilio-labs/serverless-runtime-types';

import * as Twilio from 'twilio';

// This validates that our functions can import modules
// (when uploaded to Twilio Runtime as artifacts)
import { logHello1 } from '@shared/hello/hello-util1';
import { logger } from '@shared/utils/logger';

import type { TwilioIncomingCallRequestBody } from '@shared/twilio';
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

// noinspection JSUnusedGlobalSymbols
export const handler: ServerlessFunctionSignature = (
  context: Context<MyContext>,
  event: ServerlessEventObject<MyEvent>,
  callback: ServerlessCallback,
) => {
  logHello1();

  // get greeting from env variable
  const greeting = context.GREETING ?? 'Hello';
  // get subject from request body
  const subject = event.Body ?? 'World';

  logger.info(`GREETING: ${context.GREETING}`);
  logger.info(`body: ${event.Body}`);

  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say(`${greeting}, ${subject}!`);
  callback(null, twiml);
};
