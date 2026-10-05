# Property-Based Tests - Lesson 4

This directory contains property-based tests that demonstrate Lesson 4 of the Kiro University Challenge.

## What is Property-Based Testing?

Property-based testing generates hundreds of test cases automatically by defining **properties** that must always be true, rather than writing individual example-based tests.

## Test Files

### 1. priority-validation.test.js
**Property**: Task priority must only accept "low", "medium", or "high"

**Tests**:
- ✅ Generates 100 random valid priorities and verifies acceptance
- ✅ Generates 100 random invalid strings and verifies rejection
- ✅ Tests case-sensitivity
- ✅ Tests missing priority
- ✅ Verifies all valid priorities are strings

**Property Verified**: Priority validation is exhaustive and consistent

### 2. date-validation.test.js
**Property**: Due dates must always be in the future

**Tests**:
- ✅ Generates 200 random future dates (1-5 years ahead) and verifies acceptance
- ✅ Generates 200 random past dates (1-10 years ago) and verifies rejection
- ✅ Tests edge case (current time)
- ✅ Generates 100 invalid date formats and verifies rejection
- ✅ Tests various ISO date formats
- ✅ Verifies validation is idempotent (same input = same output)

**Property Verified**: Date validation is correct across all possible dates

### 3. email-validation.test.js
**Property**: User emails must follow valid format (user@domain.tld)

**Tests**:
- ✅ Generates 200 random valid emails using fast-check's emailAddress generator
- ✅ Generates 100 strings without @ and verifies rejection
- ✅ Tests empty/null emails
- ✅ Tests emails without domain extension
- ✅ Generates 150 valid email patterns (local@domain.tld)
- ✅ Tests case-insensitivity
- ✅ Tests special characters in local part

**Property Verified**: Email validation follows RFC standards

### 4. status-transitions.test.js
**Property**: Task status can only transition forward (pending → in-progress → completed)

**Tests**:
- ✅ Verifies all valid forward transitions
- ✅ Generates and rejects all backward transitions
- ✅ Generates 50 cases of same-status (always valid)
- ✅ Generates 100 invalid status values and verifies rejection
- ✅ Verifies transition graph is acyclic
- ✅ Tests transitive transitions
- ✅ Verifies determinism (same input = same output)
- ✅ Generates 100 random transitions from "completed" (all fail except same-state)

**Property Verified**: Status state machine is correct and forward-only

## Running the Tests

### Run all tests:
```bash
npm test
```

### Run only property-based tests:
```bash
npm run test:property
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run with coverage:
```bash
npm test -- --coverage
```

## Test Statistics

Total property-based tests: **Over 1,000 test cases generated automatically**

- Priority validation: 100+ cases
- Date validation: 400+ cases
- Email validation: 450+ cases
- Status transitions: 250+ cases

## Why Property-Based Testing?

### Traditional Example-Based Testing:
```javascript
test('should validate priority', () => {
  expect(validate({ priority: 'low' })).toBeValid();
  expect(validate({ priority: 'medium' })).toBeValid();
  expect(validate({ priority: 'high' })).toBeValid();
  expect(validate({ priority: 'invalid' })).toBeInvalid();
});
```
❌ **Problem**: Only tests 4 cases. What about "LOW", "Low", "", null, 123, etc.?

### Property-Based Testing:
```javascript
test('should only accept low, medium, or high', () => {
  fc.assert(
    fc.property(
      fc.string().filter(s => !['low', 'medium', 'high'].includes(s)),
      (invalidPriority) => {
        return validate({ priority: invalidPriority }).isInvalid();
      }
    ),
    { numRuns: 100 }
  );
});
```
✅ **Benefit**: Tests 100+ random invalid inputs automatically!

## Properties Verified

### 1. **Exhaustiveness**
All possible valid inputs are accepted, all invalid inputs are rejected

### 2. **Determinism**
Same input always produces same output

### 3. **Idempotency**
Running validation multiple times produces same result

### 4. **Consistency**
Validation rules are consistent across all code paths

### 5. **State Machine Correctness**
Status transitions follow defined rules (acyclic graph)

## Integration with Spec

These property-based tests directly implement the testable properties identified in the Feature Spec (`.kiro/specs/task-management-api.md`):

- ✅ REQ-2.1: Priority enum validation
- ✅ REQ-2.1: Date validation (future dates only)
- ✅ REQ-1.1: Email format validation
- ✅ REQ-2.4: Status transition rules

## Lesson 4 Demonstration

These tests demonstrate:
- ✅ **Property-based testing** using fast-check library
- ✅ **Hundreds of test cases** generated automatically
- ✅ **Business rule verification** through properties
- ✅ **Edge case discovery** through random generation
- ✅ **Confidence in correctness** through exhaustive testing
