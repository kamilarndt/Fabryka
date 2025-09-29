import { describe, it, expect } from 'vitest';

describe('Example Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have correct environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
