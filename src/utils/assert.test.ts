/**
 * Test Suite for Assertion Utilities
 * Tests Power of Ten Rule 5: Minimum 2 assertions per function
 */

import { describe, it, expect } from "vitest";
import {
  assert,
  assertDefined,
  assertInRange,
  assertMaxLength,
  assertNonEmptyString,
  assertSafeInteger,
  assertValidIndex,
  AssertionError,
} from "./assert";

describe("assert", () => {
  it("should pass when condition is true", () => {
    expect(() => assert(true, "Should pass")).not.toThrow();
  });

  it("should throw AssertionError when condition is false", () => {
    expect(() => assert(false, "Should fail")).toThrow(AssertionError);
  });

  it("should include message in error", () => {
    expect(() => assert(false, "Custom message")).toThrow("Custom message");
  });
});

describe("assertDefined", () => {
  it("should pass for defined values", () => {
    expect(() => assertDefined(0, "Number")).not.toThrow();
    expect(() => assertDefined("", "String")).not.toThrow();
    expect(() => assertDefined(false, "Boolean")).not.toThrow();
    expect(() => assertDefined({}, "Object")).not.toThrow();
  });

  it("should throw for null", () => {
    expect(() => assertDefined(null, "Null value")).toThrow(AssertionError);
  });

  it("should throw for undefined", () => {
    expect(() => assertDefined(undefined, "Undefined value")).toThrow(
      AssertionError
    );
  });
});

describe("assertInRange", () => {
  it("should pass for values within range", () => {
    expect(() => assertInRange(5, 0, 10, "In range")).not.toThrow();
    expect(() => assertInRange(0, 0, 10, "Lower bound")).not.toThrow();
    expect(() => assertInRange(10, 0, 10, "Upper bound")).not.toThrow();
  });

  it("should throw for values below range", () => {
    expect(() => assertInRange(-1, 0, 10, "Below range")).toThrow(
      AssertionError
    );
  });

  it("should throw for values above range", () => {
    expect(() => assertInRange(11, 0, 10, "Above range")).toThrow(
      AssertionError
    );
  });

  it("should include value and range in error message", () => {
    expect(() => assertInRange(15, 0, 10, "Out of range")).toThrow(/15/);
    expect(() => assertInRange(15, 0, 10, "Out of range")).toThrow(/0/);
    expect(() => assertInRange(15, 0, 10, "Out of range")).toThrow(/10/);
  });
});

describe("assertMaxLength", () => {
  it("should pass for arrays within max length", () => {
    expect(() => assertMaxLength([1, 2, 3], 5, "Within max")).not.toThrow();
    expect(() => assertMaxLength([1, 2, 3], 3, "At max")).not.toThrow();
    expect(() => assertMaxLength([], 5, "Empty array")).not.toThrow();
  });

  it("should throw for arrays exceeding max length", () => {
    expect(() => assertMaxLength([1, 2, 3, 4], 3, "Too long")).toThrow(
      AssertionError
    );
  });

  it("should include length and max in error message", () => {
    expect(() => assertMaxLength([1, 2, 3, 4], 3, "Too long")).toThrow(/4/);
    expect(() => assertMaxLength([1, 2, 3, 4], 3, "Too long")).toThrow(/3/);
  });
});

describe("assertNonEmptyString", () => {
  it("should pass for non-empty strings", () => {
    expect(() => assertNonEmptyString("hello", "Valid")).not.toThrow();
    expect(() => assertNonEmptyString(" ", "Whitespace")).not.toThrow();
  });

  it("should throw for empty string", () => {
    expect(() => assertNonEmptyString("", "Empty")).toThrow(AssertionError);
  });

  it("should throw for non-string values", () => {
    expect(() =>
      assertNonEmptyString(123 as unknown as string, "Number")
    ).toThrow(AssertionError);
  });
});

describe("assertSafeInteger", () => {
  it("should pass for safe integers", () => {
    expect(() => assertSafeInteger(0, "Zero")).not.toThrow();
    expect(() => assertSafeInteger(42, "Positive")).not.toThrow();
    expect(() => assertSafeInteger(-42, "Negative")).not.toThrow();
    expect(() =>
      assertSafeInteger(Number.MAX_SAFE_INTEGER, "Max safe")
    ).not.toThrow();
    expect(() =>
      assertSafeInteger(Number.MIN_SAFE_INTEGER, "Min safe")
    ).not.toThrow();
  });

  it("should throw for unsafe integers", () => {
    expect(() =>
      assertSafeInteger(Number.MAX_SAFE_INTEGER + 1, "Too large")
    ).toThrow(AssertionError);
    expect(() =>
      assertSafeInteger(Number.MIN_SAFE_INTEGER - 1, "Too small")
    ).toThrow(AssertionError);
  });

  it("should throw for floating point numbers", () => {
    expect(() => assertSafeInteger(3.14, "Float")).toThrow(AssertionError);
  });
});

describe("assertValidIndex", () => {
  const testArray = [1, 2, 3, 4, 5];

  it("should pass for valid indices", () => {
    expect(() => assertValidIndex(testArray, 0, "First")).not.toThrow();
    expect(() => assertValidIndex(testArray, 4, "Last")).not.toThrow();
    expect(() => assertValidIndex(testArray, 2, "Middle")).not.toThrow();
  });

  it("should throw for negative indices", () => {
    expect(() => assertValidIndex(testArray, -1, "Negative")).toThrow(
      AssertionError
    );
  });

  it("should throw for indices beyond array length", () => {
    expect(() => assertValidIndex(testArray, 5, "Beyond")).toThrow(
      AssertionError
    );
  });

  it("should throw for non-integer indices", () => {
    expect(() => assertValidIndex(testArray, 2.5, "Float")).toThrow(
      AssertionError
    );
  });
});

describe("AssertionError", () => {
  it("should be instance of Error", () => {
    const error = new AssertionError("Test error");
    expect(error).toBeInstanceOf(Error);
  });

  it("should have correct name", () => {
    const error = new AssertionError("Test error");
    expect(error.name).toBe("AssertionError");
  });

  it("should include message", () => {
    const error = new AssertionError("Test error");
    expect(error.message).toBe("Test error");
  });
});
