/**
 * Twilio Messaging webhook TypeScript definitions derived from Twilio docs.
 * All values arrive via application/x-www-form-urlencoded as strings.
 * Derived from https://www.twilio.com/docs/messaging/guides/webhook-request
 */

import type {
  TwilioFormBody,
  TwilioAddress,
  TwilioGeoFieldsFrom,
  TwilioGeoFieldsTo,
} from './common-types';
export {
  TwilioFormBody,
  TwilioAddress,
  TwilioGeoFieldsFrom,
  TwilioGeoFieldsTo,
} from './common-types';

// --- Geographic fields (optional) ---
export type TwilioMsgGeoFrom = TwilioGeoFieldsFrom;

export type TwilioMsgGeoTo = TwilioGeoFieldsTo;

// Dynamic media fields helpers
export interface TwilioMediaIndexedFields {
  /** URL for media file. Keys are MediaUrl0, MediaUrl1, ... */
  [key: `MediaUrl${number}`]: string | undefined;
  /** Content type for media file. Keys are MediaContentType0, MediaContentType1, ... */
  [key: `MediaContentType${number}`]: string | undefined;
}

/**
 * Incoming Messaging webhook request body sent by Twilio (SMS/MMS/WhatsApp/RCS).
 * All values are strings because the payload is URL-encoded form data.
 */
export interface TwilioIncomingMessageRequestBody
  extends TwilioFormBody,
    TwilioMsgGeoFrom,
    TwilioMsgGeoTo,
    TwilioMediaIndexedFields {
  // Identifiers
  MessageSid: string;
  /** Deprecated, kept for backward compatibility */
  SmsSid?: string;
  /** Deprecated, kept for backward compatibility */
  SmsMessageSid?: string;
  AccountSid: string;
  MessagingServiceSid?: string;

  // Message addressing and content
  From: TwilioAddress;
  To: TwilioAddress;
  /** Up to 1600 characters */
  Body?: string;
  /** Number of media items attached (stringified integer) */
  NumMedia: string;
  /** For SMS/MMS, number of message segments */
  NumSegments?: string;

  // WhatsApp-specific optional parameters
  ProfileName?: string;
  /** Sender’s WhatsApp ID (phone number) */
  WaId?: string;
  /** 'true' if message was forwarded once */
  Forwarded?: 'true' | 'false';
  /** 'true' if message was frequently forwarded */
  FrequentlyForwarded?: 'true' | 'false';
  /** Text of a Quick Reply button */
  ButtonText?: string;

  // WhatsApp location sharing (optional)
  Latitude?: string;
  Longitude?: string;
  Address?: string;
  Label?: string;

  // Click-to-WhatsApp advertisement (optional)
  ReferralBody?: string;
  ReferralHeadline?: string;
  ReferralSourceId?: string;
  ReferralSourceType?: string; // e.g., 'post'
  ReferralSourceUrl?: string;
  ReferralMediaId?: string;
  ReferralMediaContentType?: string; // e.g., 'image/jpeg'
  ReferralMediaUrl?: string;
  ReferralNumMedia?: string;
  /** ID for Click-to-WhatsApp event (for Meta API) */
  ReferralCtwaClid?: string;

  // Reply-to-message (optional)
  OriginalRepliedMessageSender?: string; // e.g., 'whatsapp:+14017122661'
  OriginalRepliedMessageSid?: string; // e.g., 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
}

/** Basic type guard for required inbound message fields. */
export function isTwilioIncomingMessageBody(
  body: TwilioFormBody,
): body is TwilioIncomingMessageRequestBody {
  return (
    typeof (body as any).MessageSid === 'string' &&
    typeof (body as any).AccountSid === 'string' &&
    typeof (body as any).From === 'string' &&
    typeof (body as any).To === 'string' &&
    typeof (body as any).NumMedia === 'string'
  );
}
