import { pino } from 'pino';

import type { LoggerOptions, DestinationStream, Logger } from 'pino';
import type { PrettyOptions } from 'pino-pretty';

function createLogger() {
  const level = process.env.LOG_LEVEL || 'info';

  // Default: plain pino (fast, JSON)
  const options: LoggerOptions = { level };
  let stream: DestinationStream | undefined;

  // Use pino-pretty for tests
  if (process.env.VITEST === 'true' || process.env.PINO_PRETTY === 'true') {
    const pretty: (
      opts?: PrettyOptions,
      // have to use require because we don't have pino-pretty in prod deps
      // eslint-disable-next-line @typescript-eslint/no-require-imports
    ) => NodeJS.WritableStream = require('pino-pretty') as (
      opts?: PrettyOptions,
    ) => NodeJS.WritableStream;

    stream = pretty({
      colorize: true,
      sync: true,
    });
  }

  return pino(options, stream);
}

export const logger = createLogger();
