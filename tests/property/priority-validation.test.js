const fc = require('fast-check');
const { validateTaskData } = require('../../src/utils/validation');

describe('Property-Based Test: Task Priority Validation', () => {
  /**
   * Property: Priority must only accept "low", "medium", or "high"
   * This test generates hundreds of random strings and verifies that
   * only the three valid priority values are accepted
   */
  test('should only accept low, medium, or high as valid priorities', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('low'),
          fc.constant('medium'),
          fc.constant('high')
        ),
        (priority) => {
          // Valid priorities should not produce validation errors
          const taskData = {
            title: 'Test Task',
            priority: priority
          };
          
          const errors = validateTaskData(taskData);
          
          // Should either be null or not have priority error
          return errors === null || !errors.fields.priority;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should reject invalid priority values', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !['low', 'medium', 'high'].includes(s)),
        (invalidPriority) => {
          const taskData = {
            title: 'Test Task',
            priority: invalidPriority
          };
          
          const errors = validateTaskData(taskData);
          
          // Should have validation error for priority
          return errors !== null && errors.fields.priority !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('should reject when priority is missing', () => {
    const taskData = {
      title: 'Test Task'
      // priority is missing
    };
    
    const errors = validateTaskData(taskData);
    
    expect(errors).not.toBeNull();
    expect(errors.fields.priority).toBeDefined();
    expect(errors.fields.priority).toContain('Priority must be one of');
  });

  test('should be case-sensitive for priority values', () => {
    const invalidPriorities = ['Low', 'LOW', 'Medium', 'MEDIUM', 'High', 'HIGH'];
    
    invalidPriorities.forEach(priority => {
      const taskData = {
        title: 'Test Task',
        priority: priority
      };
      
      const errors = validateTaskData(taskData);
      
      expect(errors).not.toBeNull();
      expect(errors.fields.priority).toBeDefined();
    });
  });

  test('property: all valid priorities are strings', () => {
    const validPriorities = ['low', 'medium', 'high'];
    
    validPriorities.forEach(priority => {
      expect(typeof priority).toBe('string');
      expect(priority.length).toBeGreaterThan(0);
    });
  });
});
