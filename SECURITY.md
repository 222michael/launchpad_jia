# 🔒 Security Documentation

**Sprint Round - Ticket #3: XSS Prevention**  
**Last Updated:** November 7, 2025

---

## Overview

This document outlines the security measures implemented to protect the Jia application against Cross-Site Scripting (XSS) attacks and other security vulnerabilities.

---

## XSS Prevention Implementation

### What is XSS?

Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users. This can lead to:
- Session hijacking
- Cookie theft
- Phishing attacks
- Malware distribution
- Data theft

### Our Protection Strategy

We implement a **defense-in-depth** approach with multiple layers of protection:

1. **Input Validation** - Verify data types and formats
2. **Input Sanitization** - Remove or escape dangerous content
3. **Output Encoding** - Safely display user content
4. **Content Security Policy** - Browser-level protection

---

## Protected Endpoints

### 1. Add Career Endpoint
**File:** `src/app/api/add-career/route.ts`

**Protected Fields:**
- `jobTitle` - Plain text sanitization
- `description` - HTML sanitization (allows safe tags)
- `location` - Plain text sanitization
- `workSetup` - Plain text sanitization
- `workSetupRemarks` - Plain text sanitization
- `country` - Plain text sanitization
- `province` - Plain text sanitization
- `employmentType` - Plain text sanitization
- `questions` - Object sanitization
- `screeningSetting` - Object sanitization

**Security Measures:**
- ✅ Input validation before processing
- ✅ XSS detection and logging
- ✅ Field-specific sanitization
- ✅ Length validation
- ✅ Type checking

### 2. Update Career Endpoint
**File:** `src/app/api/update-career/route.tsx`

**Protected Fields:** Same as Add Career

**Security Measures:**
- ✅ All user input fields sanitized
- ✅ XSS detection and logging
- ✅ Timestamp tracking
- ✅ Selective field updates

---

## Sanitization Functions

### `sanitizeHTML(html: string)`

**Purpose:** Sanitize HTML content while preserving safe formatting

**Allowed Tags:**
- Paragraphs: `<p>`, `<br>`
- Text formatting: `<strong>`, `<em>`, `<u>`
- Headings: `<h1>` through `<h6>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Links: `<a>` (with href validation)
- Code: `<code>`, `<pre>`
- Quotes: `<blockquote>`

**Blocked:**
- `<script>` tags
- `<iframe>` tags
- Event handlers (onclick, onerror, etc.)
- `javascript:` URLs
- `data:` URLs
- All other potentially dangerous tags

**Example:**
```typescript
// Input
const input = '<p>Hello</p><script>alert("XSS")</script>';

// Output
const output = sanitizeHTML(input);
// Result: '<p>Hello</p>'
```

---

### `sanitizeText(text: string)`

**Purpose:** Remove all HTML and dangerous characters

**Actions:**
- Removes all HTML tags
- Escapes special characters (`<`, `>`, `&`, `"`, `'`)
- Removes null bytes
- Trims whitespace

**Example:**
```typescript
// Input
const input = '<script>alert("XSS")</script>Hello';

// Output
const output = sanitizeText(input);
// Result: 'Hello'
```

---

### `sanitizeURL(url: string)`

**Purpose:** Validate and sanitize URLs

**Checks:**
- Blocks `javascript:` protocol
- Blocks `data:` protocol
- Blocks `vbscript:` protocol
- Blocks `file:` protocol
- Validates URL format
- Only allows `http:` and `https:`

**Example:**
```typescript
// Safe URL
sanitizeURL('https://example.com'); // ✅ Returns: 'https://example.com'

// Dangerous URL
sanitizeURL('javascript:alert("XSS")'); // ❌ Returns: ''
```

---

### `sanitizeObject(obj: any, htmlFields: string[])`

**Purpose:** Recursively sanitize all strings in an object

**Features:**
- Handles nested objects
- Handles arrays
- Preserves non-string values
- Allows HTML in specified fields

**Example:**
```typescript
const input = {
  title: '<script>XSS</script>',
  description: '<p>Safe HTML</p>',
  nested: {
    field: '<img onerror="alert()">'
  }
};

const output = sanitizeObject(input, ['description']);
// Result: {
//   title: '',
//   description: '<p>Safe HTML</p>',
//   nested: { field: '' }
// }
```

---

### `validateCareerData(data: any)`

**Purpose:** Validate career post data structure

**Checks:**
- Required fields present
- Correct data types
- String length limits
- Array type validation

**Returns:**
```typescript
{
  isValid: boolean,
  error?: string
}
```

---

### `detectXSS(text: string)`

**Purpose:** Detect potential XSS attempts for logging

**Detects:**
- `<script>` tags
- `javascript:` protocol
- Event handlers (onclick, onerror, etc.)
- `<iframe>` tags
- `eval()` calls
- `expression()` calls
- `<embed>` and `<object>` tags

**Use Case:** Logging and monitoring suspicious activity

---

## Testing

### Unit Tests
**File:** `src/lib/security/sanitize.test.ts`

**Coverage:**
- ✅ Script tag removal
- ✅ Event handler removal
- ✅ Protocol validation
- ✅ HTML tag filtering
- ✅ Special character escaping
- ✅ Nested object sanitization
- ✅ Array sanitization
- ✅ XSS detection

**Run Tests:**
```bash
npm test src/lib/security/sanitize.test.ts
```

---

## Common XSS Attack Vectors (Blocked)

### 1. Script Injection
```html
<script>alert('XSS')</script>
<script src="http://evil.com/xss.js"></script>
```
**Status:** ✅ Blocked

### 2. Event Handler Injection
```html
<img src="x" onerror="alert('XSS')">
<body onload="alert('XSS')">
<div onclick="alert('XSS')">
```
**Status:** ✅ Blocked

### 3. JavaScript Protocol
```html
<a href="javascript:alert('XSS')">Click</a>
<iframe src="javascript:alert('XSS')">
```
**Status:** ✅ Blocked

### 4. Data Protocol
```html
<img src="data:text/html,<script>alert('XSS')</script>">
```
**Status:** ✅ Blocked

### 5. Iframe Injection
```html
<iframe src="http://evil.com"></iframe>
```
**Status:** ✅ Blocked

### 6. Object/Embed Tags
```html
<object data="http://evil.com/xss.swf">
<embed src="http://evil.com/xss.swf">
```
**Status:** ✅ Blocked

---

## Best Practices

### For Developers

1. **Always sanitize user input** before storing in database
2. **Validate data types** and formats
3. **Use appropriate sanitization** (HTML vs plain text)
4. **Log suspicious activity** for monitoring
5. **Test with XSS payloads** before deployment
6. **Keep dependencies updated** (DOMPurify, validator)

### For Content

1. **Job descriptions** can contain safe HTML formatting
2. **Job titles** should be plain text only
3. **URLs** must use http:// or https:// protocols
4. **Questions** can contain HTML in description field only

---

## Dependencies

### DOMPurify
**Version:** Latest  
**Purpose:** HTML sanitization  
**Documentation:** https://github.com/cure53/DOMPurify

### Validator.js
**Version:** Latest  
**Purpose:** String validation and sanitization  
**Documentation:** https://github.com/validatorjs/validator.js

---

## Monitoring & Logging

### XSS Attempt Detection

When potential XSS is detected:
```typescript
console.warn('Potential XSS attempt detected in career post submission');
```

**Logged Information:**
- Timestamp
- Endpoint (add-career or update-career)
- Detection trigger

**Recommended Actions:**
- Monitor logs for patterns
- Investigate repeated attempts
- Consider rate limiting for suspicious IPs

---

## Future Enhancements

### Planned Improvements

1. **Content Security Policy (CSP)** headers
2. **Rate limiting** for API endpoints
3. **IP-based blocking** for repeated XSS attempts
4. **Advanced threat detection** with machine learning
5. **Security audit logging** to database
6. **Automated security testing** in CI/CD pipeline

---

## Security Incident Response

### If XSS is Detected

1. **Immediate:** Block the request
2. **Log:** Record the attempt with details
3. **Alert:** Notify security team
4. **Investigate:** Check for successful attacks
5. **Patch:** Update sanitization rules if needed
6. **Monitor:** Watch for similar attempts

---

## Compliance

### Standards Followed

- ✅ OWASP Top 10 - XSS Prevention
- ✅ OWASP XSS Prevention Cheat Sheet
- ✅ CWE-79: Cross-site Scripting
- ✅ SANS Top 25 - CWE-79

---

## Contact

For security concerns or to report vulnerabilities:
- **Email:** launchpad@whitecloak.com
- **Subject:** [SECURITY] Vulnerability Report

---

**Last Security Audit:** November 7, 2025  
**Next Scheduled Audit:** After Sprint Round completion

---

*This security implementation is part of Sprint Round Ticket #3*
