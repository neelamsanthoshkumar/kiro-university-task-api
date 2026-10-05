const fc = require('fast-check');
const { isValidStatusTransition } = require('../../src/utils/validation');

describe('Property-Based Test: Status Transitions', () => {
  /**
   * Property: Status can only transition forward
   * pending → in-progress → completed
   */
  test('should allow valid forward transitions', () => {
    const validTransitions = [
      { from: 'pending', to: 'in-progress' },
      { from: 'pending', to: 'completed' },
      { from: 'in-progress', to: 'completed' }
    ];
    
    validTransitions.forEach(({ from, to }) => {
      const result = isValidStatusTransition(from, to);
      expect(result).toBe(true);
    });
  });

  /**
   * Property: Backward transitions are not allowed
   */
  test('should reject backward transitions', () => {
    const invalidTransitions = [
      { from: 'in-progress', to: 'pending' },
      { from: 'completed', to: 'pending' },
      { from: 'completed', to: 'in-progress' }
    ];
    
    invalidTransitions.forEach(({ from, to }) => {
      const result = isValidStatusTransition(from, to);
      expect(result).toBe(false);
    });
  });

  /**
   * Property: Same status is always valid (no change)
   */
  test('should allow staying in same status', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('pending', 'in-progress', 'completed'),
        (status) => {
          const result = isValidStatusTransition(status, status);
          return result === true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Invalid status values should return false
   */
  test('should reject invalid status values', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !['pending', 'in-progress', 'completed'].includes(s)),
        fc.constantFrom('pending', 'in-progress', 'completed'),
        (invalidStatus, validStatus) => {
          const result = isValidStatusTransition(invalidStatus, validStatus);
          return result === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Transition graph is acyclic
   * Once a task moves forward, it can never go back
   */
  test('should maintain acyclic transition graph', () => {
    // From pending, can go to in-progress or completed
    expect(isValidStatusTransition('pending', 'in-progress')).toBe(true);
    expect(isValidStatusTransition('pending', 'completed')).toBe(true);
    
    // From in-progress, can only go to completed
    expect(isValidStatusTransition('in-progress', 'completed')).toBe(true);
    expect(isValidStatusTransition('in-progress', 'pending')).toBe(false);
    
    // From completed, cannot go anywhere
    expect(isValidStatusTransition('completed', 'pending')).toBe(false);
    expect(isValidStatusTransition('completed', 'in-progress')).toBe(false);
  });

  /**
   * Property: Transitive transitions are valid
   * If A → B and B → C, then A → C is valid
   */
  test('should support transitive transitions', () => {
    // pending → in-progress (valid)
    // in-progress → completed (valid)
    // Therefore: pending → completed (should be valid)
    expect(isValidStatusTransition('pending', 'completed')).toBe(true);
  });

  /**
   * Property: Status transition is deterministic
   * Same input always produces same output
   */
  test('should be deterministic', () => {
    const testCases = [
      { from: 'pending', to: 'in-progress' },
      { from: 'in-progress', to: 'completed' },
      { from: 'completed', to: 'pending' },
      { from: 'pending', to: 'pending' }
    ];
    
    testCases.forEach(({ from, to }) => {
      const result1 = isValidStatusTransition(from, to);
      const result2 = isValidStatusTransition(from, to);
      const result3 = isValidStatusTransition(from, to);
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });

  /**
   * Property: All valid statuses have defined transitions
   */
  test('should have defined transitions for all valid statuses', () => {
    const validStatuses = ['pending', 'in-progress', 'completed'];
    
    validStatuses.forEach(status => {
      // Should be able to transition to itself
      expect(isValidStatusTransition(status, status)).toBe(true);
      
      // Should have well-defined behavior for all other statuses
      validStatuses.forEach(otherStatus => {
        const result = isValidStatusTransition(status, otherStatus);
        expect(typeof result).toBe('boolean');
      });
    });
  });

  /**
   * Property: Generate random transition sequences
   * Verify that once completed, no further transitions are valid
   */
  test('should prevent transitions from completed state', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('pending', 'in-progress', 'completed'),
        (targetStatus) => {
          const result = isValidStatusTransition('completed', targetStatus);
          // Only valid if staying in completed
          return targetStatus === 'completed' ? result === true : result === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Valid transition paths
   */
  test('should validate complete transition paths', () => {
    // Path 1: pending → in-progress → completed
    expect(isValidStatusTransition('pending', 'in-progress')).toBe(true);
    expect(isValidStatusTransition('in-progress', 'completed')).toBe(true);
    
    // Path 2: pending → completed (skip in-progress)
    expect(isValidStatusTransition('pending', 'completed')).toBe(true);
    
    // Invalid path: completed → pending
    expect(isValidStatusTransition('completed', 'pending')).toBe(false);
  });
});
