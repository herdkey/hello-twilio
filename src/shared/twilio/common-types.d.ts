// Common Twilio shared types used by both call and message webhook definitions.

import type { EnvironmentVariables } from '@twilio-labs/serverless-runtime-types/types';

/** API version string (e.g., '2010-04-01'). */
export type TwilioApiVersion = string;

/** E.164 phone number or Twilio Client identifier (e.g. '+12316851234' or 'client:alice'). */
export type TwilioAddress = string;

/** RFC 2822 in GMT. Keep as string for transport fidelity. */
export type TwilioRfc2822DateTime = string;

/** Generic container if your framework exposes the raw POST body. */
export type TwilioFormBody = Record<string, string | undefined>;

// --- Geographic fields (optional) ---
export interface TwilioGeoFieldsFrom {
  FromCity?: string;
  FromState?: string;
  FromZip?: string;
  FromCountry?: string;
}

export interface TwilioGeoFieldsTo {
  ToCity?: string;
  ToState?: string;
  ToZip?: string;
  ToCountry?: string;
}

// MIME handling hints
export type TwilioTwimlMime = 'text/xml' | 'application/xml' | 'text/html';
export type TwilioAudioMime = `audio/${string}`;
export type TwilioPlainTextMime = 'text/plain';

type RequestHeaders = {
  'x-request-id'?: string;
  't-request-id'?: string;
  accept?: string;
  'user-agent'?: string;
};

interface EnvContext extends EnvironmentVariables {
  PATH?: string;
  AUTH_TOKEN?: string;
  SERVICE_SID?: string;
  ENVIRONMENT_SID?: string;
  ACCOUNT_SID?: string;
  DOMAIN_NAME?: string;
  GREETING?: string;
}
