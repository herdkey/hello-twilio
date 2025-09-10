import { describe, it, expect } from 'vitest';

import { hello } from '../src/hello';

describe('hello()', () => {
  it('returns hello world', () => {
    expect(hello()).toBe('hello world');
  });
});
