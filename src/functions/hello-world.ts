import '@twilio-labs/serverless-runtime-types';

import * as Twilio from 'twilio';

// This validates that our functions can import modules
// (when uploaded to Twilio Runtime as artifacts)
import { logHello1 } from '@shared/hello/hello-util1';
import { logger } from '@shared/utils/logger';

import type { EnvContext, RequestHeaders } from '@shared/twilio';
import type {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
  ServerlessEventObject,
} from '@twilio-labs/serverless-runtime-types/types';

type HelloEvent = object;

// If you want to use environment variables, you will need to type them like
// this and add them to the Context in the function signature as
// Context<HelloContext> as you see below.
interface HelloContext extends EnvContext {
  GREETING?: string;
}

// noinspection JSUnusedGlobalSymbols
export const handler: ServerlessFunctionSignature<
  Context<HelloContext>,
  ServerlessEventObject<HelloEvent, RequestHeaders>
> = (
  context: HelloContext,
  event: ServerlessEventObject<HelloEvent, RequestHeaders>,
  callback: ServerlessCallback,
) => {
  logHello1();

  // get greeting from env variable
  const greeting = context.GREETING ?? 'Hello';

  // log greeting from env variable
  logger.info(`GREETING: ${context.GREETING}`);

  // respond with TwiML instruction to say greeting back to caller
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say(`${greeting}, world!`);

  callback(null, twiml);
};
