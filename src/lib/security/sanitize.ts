/**
 * Security Utilities - XSS Prevention
 * Sprint Round - Ticket #3
 * 
 * This module provides sanitization and validation functions to prevent
 * Cross-Site Scripting (XSS) attacks and other security vulnerabilities.
 */

import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes dangerous tags and attributes while preserving safe HTML
 * 
 * @param html - Raw HTML string from user input
 * @returns Sanitized HTML string safe for storage and display
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Configure DOMPurify to allow safe HTML tags
  const config = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  };

  return DOMPurify.sanitize(html, config);
}

/**
 * Sanitize plain text input
 * Removes all HTML tags and dangerous characters
 * 
 * @param text - Raw text string from user input
 * @returns Sanitized plain text string
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Remove all HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '');
  
  // Escape special characters
  sanitized = validator.escape(sanitized);
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  return sanitized.trim();
}

/**
 * Validate and sanitize URL
 * Ensures URL is safe and doesn't contain javascript: or data: protocols
 * 
 * @param url - URL string from user input
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Remove whitespace
  const trimmed = url.trim();

  // Check for dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = trimmed.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '';
    }
  }

  // Validate URL format
  if (!validator.isURL(trimmed, { 
    protocols: ['http', 'https'],
    require_protocol: false 
  })) {
    return '';
  }

  return trimmed;
}

/**
 * Sanitize an object recursively
 * Applies appropriate sanitization to all string values
 * 
 * @param obj - Object containing user input
 * @param htmlFields - Array of field names that should preserve HTML
 * @returns Sanitized object
 */
export function sanitizeObject(
  obj: any,
  htmlFields: string[] = []
): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, htmlFields));
  }

  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
    } else if (typeof value === 'string') {
      // Apply HTML sanitization for specified fields
      if (htmlFields.includes(key)) {
        sanitized[key] = sanitizeHTML(value);
      } else {
        sanitized[key] = sanitizeText(value);
      }
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value, htmlFields);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Validate career post data
 * Checks for required fields and validates data types
 * 
 * @param data - Career post data object
 * @returns Object with isValid flag and error message
 */
export function validateCareerData(data: any): { 
  isValid: boolean; 
  error?: string 
} {
  // Check required fields
  if (!data.jobTitle || typeof data.jobTitle !== 'string') {
    return { isValid: false, error: 'Job title is required and must be a string' };
  }

  if (!data.description || typeof data.description !== 'string') {
    return { isValid: false, error: 'Description is required and must be a string' };
  }

  if (!data.location || typeof data.location !== 'string') {
    return { isValid: false, error: 'Location is required and must be a string' };
  }

  if (!data.workSetup || typeof data.workSetup !== 'string') {
    return { isValid: false, error: 'Work setup is required and must be a string' };
  }

  // Validate string lengths
  if (data.jobTitle.length > 200) {
    return { isValid: false, error: 'Job title must be less than 200 characters' };
  }

  if (data.description.length > 10000) {
    return { isValid: false, error: 'Description must be less than 10000 characters' };
  }

  // Validate questions array if present
  if (data.questions && !Array.isArray(data.questions)) {
    return { isValid: false, error: 'Questions must be an array' };
  }

  return { isValid: true };
}

/**
 * Test if a string contains potential XSS attacks
 * Used for logging and monitoring purposes
 * 
 * @param text - Text to check
 * @returns True if potential XSS detected
 */
export function detectXSS(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onerror, etc.
    /<iframe/gi,
    /eval\(/gi,
    /expression\(/gi,
    /<embed/gi,
    /<object/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(text));
}
