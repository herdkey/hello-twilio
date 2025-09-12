import fs from 'fs';
import path from 'path';

const dir = './dist/shared';

/**
 * Make assets private by renaming .js files to .private.js
 * because we do not want to publicly expose them.
 *
 * See https://www.twilio.com/docs/serverless/functions-assets/visibility#how-to-set-visibility
 * (under the "Serverless Toolkit" tab)
 */
fs.readdirSync(dir, { recursive: true }).forEach((file) => {
  if (file.endsWith('.js') && !file.endsWith('.private.js')) {
    const oldPath = path.join(dir, file);
    const newPath = path.join(dir, file.replace(/\.js$/, '.private.js'));
    fs.renameSync(oldPath, newPath);
  }
});
