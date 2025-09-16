import { deburr } from 'lodash';

// The latest version of the `leven` package is an ESM module, so cannot be
// used in a CommonJS environment (which Twilio is). This illustrates one of
// the limitations of Twilio's serverless runtime.
// import leven from 'leven';

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
  return levenshtein(u, t) <= maxDist;
};

export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  // base cases
  if (m === 0) return n;
  if (n === 0) return m;

  // 2D array with dimensions (m+1) x (n+1)
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost, // substitution
      );
    }
  }

  return dp[m][n];
}
