import { logHello2 } from '@shared/hello/hello-util2';
import { logger } from '@shared/utils/logger';

// This validates that our modules can import other modules
// (when uploaded to Twilio Runtime as artifacts)

export const logHello1 = () => {
  logger.info('Hello from util1');
  logHello2();
};
