/**
 * Security Utilities - Unit Tests
 * Sprint Round - Ticket #3
 * 
 * Tests for XSS prevention and input sanitization
 */

import {
  sanitizeHTML,
  sanitizeText,
  sanitizeURL,
  sanitizeObject,
  validateCareerData,
  detectXSS,
} from './sanitize';

describe('XSS Prevention - sanitizeHTML', () => {
  test('should remove script tags', () => {
    const input = '<p>Hello</p><script>alert("XSS")</script>';
    const output = sanitizeHTML(input);
    expect(output).not.toContain('<script>');
    expect(output).not.toContain('alert');
  });

  test('should remove event handlers', () => {
    const input = '<img src="x" onerror="alert(\'XSS\')">';
    const output = sanitizeHTML(input);
    expect(output).not.toContain('onerror');
    expect(output).not.toContain('alert');
  });

  test('should allow safe HTML tags', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    const output = sanitizeHTML(input);
    expect(output).toContain('<p>');
    expect(output).toContain('<strong>');
  });

  test('should remove iframe tags', () => {
    const input = '<iframe src="javascript:alert(\'XSS\')"></iframe>';
    const output = sanitizeHTML(input);
    expect(output).not.toContain('<iframe>');
  });

  test('should handle empty input', () => {
    expect(sanitizeHTML('')).toBe('');
    expect(sanitizeHTML(null as any)).toBe('');
    expect(sanitizeHTML(undefined as any)).toBe('');
  });
});

describe('XSS Prevention - sanitizeText', () => {
  test('should remove all HTML tags', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    const output = sanitizeText(input);
    expect(output).not.toContain('<');
    expect(output).not.toContain('>');
  });

  test('should escape special characters', () => {
    const input = 'Test & <script>';
    const output = sanitizeText(input);
    expect(output).toContain('&amp;');
    expect(output).not.toContain('<script>');
  });

  test('should remove null bytes', () => {
    const input = 'Hello\0World';
    const output = sanitizeText(input);
    expect(output).not.toContain('\0');
  });

  test('should trim whitespace', () => {
    const input = '  Hello World  ';
    const output = sanitizeText(input);
    expect(output).toBe('Hello World');
  });
});

describe('XSS Prevention - sanitizeURL', () => {
  test('should allow valid HTTP URLs', () => {
    const input = 'https://example.com';
    const output = sanitizeURL(input);
    expect(output).toBe(input);
  });

  test('should block javascript: protocol', () => {
    const input = 'javascript:alert("XSS")';
    const output = sanitizeURL(input);
    expect(output).toBe('');
  });

  test('should block data: protocol', () => {
    const input = 'data:text/html,<script>alert("XSS")</script>';
    const output = sanitizeURL(input);
    expect(output).toBe('');
  });

  test('should block vbscript: protocol', () => {
    const input = 'vbscript:msgbox("XSS")';
    const output = sanitizeURL(input);
    expect(output).toBe('');
  });

  test('should handle invalid URLs', () => {
    const input = 'not a url';
    const output = sanitizeURL(input);
    expect(output).toBe('');
  });
});

describe('XSS Prevention - sanitizeObject', () => {
  test('should sanitize all string fields', () => {
    const input = {
      title: '<script>alert("XSS")</script>',
      description: '<p>Safe content</p>',
    };
    const output = sanitizeObject(input, ['description']);
    expect(output.title).not.toContain('<script>');
    expect(output.description).toContain('<p>');
  });

  test('should handle nested objects', () => {
    const input = {
      user: {
        name: '<script>XSS</script>',
      },
    };
    const output = sanitizeObject(input);
    expect(output.user.name).not.toContain('<script>');
  });

  test('should handle arrays', () => {
    const input = {
      items: ['<script>XSS</script>', 'Safe text'],
    };
    const output = sanitizeObject(input);
    expect(output.items[0]).not.toContain('<script>');
  });

  test('should preserve non-string values', () => {
    const input = {
      count: 42,
      active: true,
      date: new Date(),
    };
    const output = sanitizeObject(input);
    expect(output.count).toBe(42);
    expect(output.active).toBe(true);
  });
});

describe('Validation - validateCareerData', () => {
  test('should pass valid career data', () => {
    const data = {
      jobTitle: 'Software Engineer',
      description: 'Great opportunity',
      location: 'Remote',
      workSetup: 'Remote',
      questions: [],
    };
    const result = validateCareerData(data);
    expect(result.isValid).toBe(true);
  });

  test('should fail without job title', () => {
    const data = {
      description: 'Great opportunity',
      location: 'Remote',
      workSetup: 'Remote',
    };
    const result = validateCareerData(data);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Job title');
  });

  test('should fail with too long job title', () => {
    const data = {
      jobTitle: 'A'.repeat(201),
      description: 'Great opportunity',
      location: 'Remote',
      workSetup: 'Remote',
    };
    const result = validateCareerData(data);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('200 characters');
  });

  test('should fail with invalid questions type', () => {
    const data = {
      jobTitle: 'Software Engineer',
      description: 'Great opportunity',
      location: 'Remote',
      workSetup: 'Remote',
      questions: 'not an array',
    };
    const result = validateCareerData(data);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('array');
  });
});

describe('Detection - detectXSS', () => {
  test('should detect script tags', () => {
    const input = '<script>alert("XSS")</script>';
    expect(detectXSS(input)).toBe(true);
  });

  test('should detect javascript: protocol', () => {
    const input = 'javascript:alert("XSS")';
    expect(detectXSS(input)).toBe(true);
  });

  test('should detect event handlers', () => {
    const input = '<img onerror="alert(\'XSS\')">';
    expect(detectXSS(input)).toBe(true);
  });

  test('should detect iframe tags', () => {
    const input = '<iframe src="evil.com"></iframe>';
    expect(detectXSS(input)).toBe(true);
  });

  test('should not detect safe content', () => {
    const input = 'This is safe content';
    expect(detectXSS(input)).toBe(false);
  });
});
