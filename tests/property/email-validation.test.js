const fc = require('fast-check');
const { isValidEmail, validateRegistrationData } = require('../../src/utils/validation');

describe('Property-Based Test: Email Validation', () => {
  /**
   * Property: Valid email format must have @ symbol and domain
   * Generates various valid email patterns
   */
  test('should accept valid email formats', () => {
    fc.assert(
      fc.property(
        fc.emailAddress(),
        (email) => {
          const result = isValidEmail(email);
          return result === true;
        }
      ),
      { numRuns: 200 }
    );
  });

  /**
   * Property: Emails without @ symbol must be rejected
   */
  test('should reject emails without @ symbol', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !s.includes('@') && s.length > 0),
        (invalidEmail) => {
          const result = isValidEmail(invalidEmail);
          return result === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Empty or null emails must be rejected
   */
  test('should reject empty or null emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail('   ')).toBe(false);
  });

  /**
   * Property: Emails must have domain extension
   */
  test('should reject emails without domain extension', () => {
    const invalidEmails = [
      'user@domain',
      'test@example',
      'name@company'
    ];
    
    invalidEmails.forEach(email => {
      const result = isValidEmail(email);
      expect(result).toBe(false);
    });
  });

  /**
   * Property: Common valid email patterns should always pass
   */
  test('should accept common valid email patterns', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9._-]+$/.test(s)),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9.-]+$/.test(s)),
        fc.constantFrom('com', 'org', 'net', 'edu', 'io', 'dev'),
        (localPart, domain, tld) => {
          const email = `${localPart}@${domain}.${tld}`;
          const result = isValidEmail(email);
          return result === true;
        }
      ),
      { numRuns: 150 }
    );
  });

  /**
   * Property: Email validation in registration data
   */
  test('should validate email in registration data', () => {
    const validData = {
      email: 'valid@example.com',
      password: 'password123',
      name: 'Test User'
    };
    
    const errors = validateRegistrationData(validData);
    expect(errors === null || !errors.fields?.email).toBe(true);
  });

  test('should reject invalid email in registration data', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'password123',
      name: 'Test User'
    };
    
    const errors = validateRegistrationData(invalidData);
    expect(errors).not.toBeNull();
    expect(errors.fields.email).toBeDefined();
  });

  /**
   * Property: Email validation is case-insensitive (format check)
   */
  test('should accept emails regardless of case', () => {
    const emails = [
      'Test@Example.com',
      'TEST@EXAMPLE.COM',
      'test@example.com',
      'TeSt@ExAmPlE.CoM'
    ];
    
    emails.forEach(email => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  /**
   * Property: Special characters in local part
   */
  test('should handle special characters correctly', () => {
    const validEmails = [
      'user.name@example.com',
      'user_name@example.com',
      'user-name@example.com',
      'user123@example.com'
    ];
    
    validEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(true);
    });
  });
});
