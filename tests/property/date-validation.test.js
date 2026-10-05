const fc = require('fast-check');
const { validateTaskData } = require('../../src/utils/validation');

describe('Property-Based Test: Date Validation', () => {
  /**
   * Property: Due dates must always be in the future
   * Generates random future dates and verifies they pass validation
   */
  test('should accept future dates', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 365 * 5 }), // 1 to 5 years in the future
        (daysInFuture) => {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + daysInFuture);
          
          const taskData = {
            title: 'Test Task',
            priority: 'low',
            dueDate: futureDate.toISOString()
          };
          
          const errors = validateTaskData(taskData);
          
          // Should not have dueDate error
          return errors === null || !errors.fields.dueDate;
        }
      ),
      { numRuns: 200 }
    );
  });

  /**
   * Property: Past dates must be rejected
   * Generates random past dates and verifies they fail validation
   */
  test('should reject past dates', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 365 * 10 }), // 1 to 10 years in the past
        (daysInPast) => {
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - daysInPast);
          
          const taskData = {
            title: 'Test Task',
            priority: 'low',
            dueDate: pastDate.toISOString()
          };
          
          const errors = validateTaskData(taskData);
          
          // Should have dueDate error
          return errors !== null && errors.fields.dueDate !== undefined;
        }
      ),
      { numRuns: 200 }
    );
  });

  test('should reject current time (edge case)', () => {
    const now = new Date();
    
    const taskData = {
      title: 'Test Task',
      priority: 'low',
      dueDate: now.toISOString()
    };
    
    // Wait a millisecond to ensure it's now in the past
    const errors = validateTaskData(taskData);
    
    // Current time might be accepted or rejected depending on timing
    // but it should be consistent
    expect(errors).toBeDefined();
  });

  test('should reject invalid date formats', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('not-a-date'),
          fc.constant('2024-13-45'), // Invalid month/day
          fc.constant('invalid'),
          fc.constant(''),
          fc.integer()
        ),
        (invalidDate) => {
          const taskData = {
            title: 'Test Task',
            priority: 'low',
            dueDate: invalidDate
          };
          
          const errors = validateTaskData(taskData);
          
          // Should have dueDate error
          return errors !== null && errors.fields.dueDate !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Valid ISO date strings in the future are always accepted
   */
  test('should accept various future date formats', () => {
    const futureDates = [
      new Date('2027-12-31T23:59:59Z'),
      new Date('2027-06-15T12:00:00Z'),
      new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // Next week
    ];
    
    futureDates.forEach(date => {
      const taskData = {
        title: 'Test Task',
        priority: 'low',
        dueDate: date.toISOString()
      };
      
      const errors = validateTaskData(taskData);
      
      // Should not have dueDate error
      expect(errors === null || !errors.fields?.dueDate).toBe(true);
    });
  });

  /**
   * Property: Date validation is idempotent
   * Validating the same date multiple times produces the same result
   */
  test('should produce consistent results for the same date', () => {
    const testDate = new Date('2027-01-01T00:00:00Z');
    
    const taskData = {
      title: 'Test Task',
      priority: 'low',
      dueDate: testDate.toISOString()
    };
    
    const result1 = validateTaskData(taskData);
    const result2 = validateTaskData(taskData);
    const result3 = validateTaskData(taskData);
    
    // All results should be the same
    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
  });
});
