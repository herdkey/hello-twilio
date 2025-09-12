import { describe, it } from 'vitest';

import { logger } from '@shared/utils/logger';

describe('logger', () => {
  it('info log', () => {
    logger.info('Hello World');
  });
});
