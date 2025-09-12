import '@twilio-labs/serverless-runtime-types';

import * as Twilio from 'twilio';

import { logger } from '@shared/utils/logger';

import type {
  EnvContext,
  RequestHeaders,
  TwilioIncomingCallRequestBody,
} from '@shared/twilio';
import type {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
  ServerlessEventObject,
} from '@twilio-labs/serverless-runtime-types/types';

// noinspection JSUnusedGlobalSymbols
export const handler: ServerlessFunctionSignature<
  EnvContext,
  ServerlessEventObject<TwilioIncomingCallRequestBody, RequestHeaders>
> = (
  context: Context<EnvContext>,
  event: ServerlessEventObject<TwilioIncomingCallRequestBody, RequestHeaders>,
  callback: ServerlessCallback,
) => {
  const log = logger.child({
    'x-request-id': event.request.headers['x-request-id'],
    't-request-id': event.request.headers['t-request-id'],
  });

  /*
    {
      "request": {
        "headers": {
          "x-request-id": "8f43151b-04ec-4440-97b1-43f6e45ef24a",
          "t-request-id": "RQcf54b6cfc34651cd6fcb5316ef713daa",
          "accept": "*!/!*",
          "user-agent": "curl/8.7.1"
        },
        "cookies": {}
      }
    }
  */
  log.info({ event }, 'EVENT');

  /*
    {
      "PATH": "/trace-call",
      "AUTH_TOKEN": "...",
      "SERVICE_SID": "...",
      "ENVIRONMENT_SID": "...",
      "ACCOUNT_SID": "...",
      "DOMAIN_NAME": "hello-twilio-...-dev.twil.io",
      "GREETING": "Good day to you",
      "getTwilioClient": "[Function (anonymous)]"
    }
  */
  log.info({ context }, 'CONTEXT');

  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say('Goodbye.');

  callback(null, twiml);
};
