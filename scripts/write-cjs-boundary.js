/**
 * Writes a package.json file to the dist/functions directory to force
 * set the type to commonjs.
 */

import fs from 'node:fs';
import path from 'node:path';

const dir = 'dist';
const filePath = path.join(dir, 'package.json');

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  filePath,
  JSON.stringify({ type: 'commonjs' }, null, 2) + '\n',
  'utf8',
);
