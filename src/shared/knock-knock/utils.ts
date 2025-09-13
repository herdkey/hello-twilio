import leven from 'leven';
import { deburr } from 'lodash';

const normalize = (s = '') =>
  deburr(String(s))
    .toLowerCase()
    .replace(/['’]/g, '') // drop apostrophes for robust matching
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const approxIncludes = (
  utterance: string,
  target: string,
  maxDist = 2,
) => {
  const u = normalize(utterance);
  const t = normalize(target);
  if (u.includes(t)) return true;
  // whole-phrase distance check (short phrases benefit from this)
  return leven(u, t) <= maxDist;
};
