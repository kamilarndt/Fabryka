import { describe, it, expect } from 'vitest';

// Mock function for testing - this will be implemented later
function generateElementCode(): string {
  const prefix = 'EL-';
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  return `${prefix}${timestamp}-${random}`.toUpperCase();
}

describe('generateElementCode', () => {
  it('should return a string starting with "EL-"', () => {
    const code = generateElementCode();
    expect(code).toMatch(/^EL-/);
    expect(code.length).toBeGreaterThan(3);
  });

  it('should generate unique codes', () => {
    const code1 = generateElementCode();
    const code2 = generateElementCode();
    expect(code1).not.toBe(code2);
  });

  it('should be uppercase', () => {
    const code = generateElementCode();
    expect(code).toBe(code.toUpperCase());
  });

  it('should have consistent format', () => {
    const code = generateElementCode();
    expect(code).toMatch(/^EL-[A-Z0-9]+-[A-Z0-9]+$/);
  });
});
