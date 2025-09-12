// Twilio webhook and TwiML related TypeScript definitions derived from

/** Twilio call status values */
export type TwilioCallStatus =
  | 'queued'
  | 'ringing'
  | 'in-progress'
  | 'completed'
  | 'busy'
  | 'failed'
  | 'no-answer'
  | 'canceled';

/** Direction values */
export type TwilioCallDirection = 'inbound' | 'outbound-api' | 'outbound-dial';

/** Status callback event values */
export type TwilioStatusCallbackEvent =
  | 'initiated'
  | 'ringing'
  | 'answered'
  | 'completed';

/** API version string (e.g., '2010-04-01'). */
export type TwilioApiVersion = string;

/** E.164 phone number or Twilio Client identifier (e.g. '+12316851234' or 'client:alice'). */
export type TwilioAddress = string;

/** RFC 2822 in GMT. Keep as string for transport fidelity. */
export type TwilioRfc2822DateTime = string;

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

/**
 * Body fields Twilio includes when your webhook receives an inbound call,
 * plus optional geo fields.
 *
 * Note: Twilio POSTs application/x-www-form-urlencoded; values arrive as strings.
 */
export interface TwilioIncomingCallRequestBody
  extends TwilioGeoFieldsFrom,
    TwilioGeoFieldsTo,
    TwilioFormBody {
  /** Unique identifier for the call */
  CallSid: string;
  /** Your Twilio account SID */
  AccountSid: string;
  /** Caller’s number or client identifier */
  From: TwilioAddress;
  /** Number or client identifier dialed */
  To: TwilioAddress;
  /** queued | ringing | in-progress | completed | busy | failed | no-answer | canceled */
  CallStatus: TwilioCallStatus;
  /** API version in use */
  ApiVersion: TwilioApiVersion;
  /** inbound | outbound-api | outbound-dial */
  Direction: TwilioCallDirection;
  /** Present if number was forwarded */
  ForwardedFrom?: string;
  /** CNAM or caller name, if available */
  CallerName?: string;
}

/** Extra fields that may be present on status callbacks. */
export interface TwilioStatusCallbackExtras {
  /** Total call duration in seconds (string from form data). */
  CallDuration?: string;
  /** Recording URL for retrieval (if a recording was made). */
  RecordingUrl?: string;
  /** Recording SID (if a recording was made). */
  RecordingSid?: string;
  /** Recording duration in seconds (string from form data). */
  RecordingDuration?: string;
}

/**
 * Status callback webhook body. Contains the base incoming-call fields,
 * optional geo data, plus status/recording extras.
 */
export interface TwilioStatusCallbackRequestBody
  extends TwilioIncomingCallRequestBody,
    TwilioStatusCallbackExtras {
  /** One of 'initiated' | 'ringing' | 'answered' | 'completed' when configured. */
  StatusCallbackEvent?: TwilioStatusCallbackEvent;
}

/** Generic container if your framework exposes the raw POST body. */
export type TwilioFormBody = Record<string, string | undefined>;

/** Type guard: checks base inbound-call fields are present. */
export function isTwilioIncomingCallBody(
  body: TwilioFormBody,
): body is TwilioIncomingCallRequestBody {
  return (
    typeof body.CallSid === 'string' &&
    typeof body.AccountSid === 'string' &&
    typeof body.From === 'string' &&
    typeof body.To === 'string' &&
    typeof body.CallStatus === 'string' &&
    typeof body.ApiVersion === 'string' &&
    typeof body.Direction === 'string'
  );
}

/** Parse numeric-like seconds from Twilio form payloads. */
export function parseSeconds(value?: string): number | undefined {
  return value != null && value !== '' ? Number.parseInt(value, 10) : undefined;
}

// --- Minimal TwiML authoring types ---
export interface TwiMLResponse {
  Response: TwiMLNode[] | TwiMLNode;
}

export type TwiMLNode =
  | TwiMLSay
  | TwiMLPlay
  | TwiMLDial
  | TwiMLRecord
  | TwiMLGather
  | { Hangup: Record<string, never> }
  | { Enqueue: Record<string, never> }
  | { Leave: Record<string, never> }
  | { Pause: { length?: number } }
  | { Redirect: { url: string; method?: 'GET' | 'POST' } }
  | { Refer: { url: string } }
  | { Reject: { reason?: 'rejected' | 'busy' } };

export interface TwiMLSay {
  Say: { voice?: string; language?: string; loop?: number; text: string };
}

export interface TwiMLPlay {
  Play: { loop?: number; url: string };
}

export interface TwiMLDial {
  Dial: {
    Number: TwiMLDialNumber | TwiMLDialNumber[];
    // Future: other nouns like <Client>, <Conference>
  };
}

export interface TwiMLDialNumber {
  /** E.164 or client identifier. */
  value: TwilioAddress;
  /** Lifecycle callback URL and options. */
  statusCallback?: string; // URL
  statusCallbackMethod?: 'GET' | 'POST';
  /** Space-delimited in TwiML; array here for ergonomics. */
  statusCallbackEvent?: TwilioStatusCallbackEvent[];
}

export interface TwiMLRecord {
  Record: {
    action?: string;
    method?: 'GET' | 'POST';
    timeout?: number;
    transcribe?: boolean;
    playBeep?: boolean;
    maxLength?: number;
  };
}

export interface TwiMLGather {
  Gather: {
    input?: ('dtmf' | 'speech')[];
    numDigits?: number;
    timeout?: number;
    action?: string;
    method?: 'GET' | 'POST';
    hints?: string;
  } & ({ Say: TwiMLSay['Say'] } | { Play: TwiMLPlay['Play'] } | object);
}

// MIME handling hints
export type TwilioTwimlMime = 'text/xml' | 'application/xml' | 'text/html';
export type TwilioAudioMime = `audio/${string}`;
export type TwilioPlainTextMime = 'text/plain';
