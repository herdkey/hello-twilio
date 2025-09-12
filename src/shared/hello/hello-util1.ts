import { logger } from '@shared/utils/logger';

// This validates that our modules can import other modules
// (when uploaded to Twilio Runtime as artifacts)
import { logHello2 } from './hello-util2';

export const logHello1 = () => {
  logger.info('Hello from util1');
  logHello2();
};
