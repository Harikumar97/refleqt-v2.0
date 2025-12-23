/**
 * Test Suite for Safety Utilities
 * Tests Power of Ten Rules 2, 3, and 9
 */

import { describe, it, expect } from "vitest";
import {
  safeIterate,
  safeArrayAccess,
  safeParseInt,
  safeDivide,
  clamp,
  FixedBuffer,
  MAX_ITERATIONS,
  MAX_FEED_ITEMS,
} from "./safety";

describe("safeIterate", () => {
  it("should iterate over all items successfully", () => {
    const items = [1, 2, 3, 4, 5];
    const results: number[] = [];

    const result = safeIterate(items, (item) => {
      results.push(item);
    });

    expect(result.success).toBe(true);
    expect(results).toEqual([1, 2, 3, 4, 5]);
  });

  it("should respect max iterations limit", () => {
    const items = Array(10).fill(0);
    const maxIterations = 5;
    let count = 0;

    const result = safeIterate(
      items,
      () => {
        count++;
      },
      maxIterations
    );

    expect(result.success).toBe(true);
    expect(count).toBe(maxIterations);
  });

  it("should handle arrays larger than max iterations", () => {
    const items = Array(100).fill(0);
    const maxIterations = 10;
    let count = 0;

    const result = safeIterate(
      items,
      () => {
        count++;
      },
      maxIterations
    );

    expect(result.success).toBe(true);
    expect(count).toBe(maxIterations); // Only processes up to maxIterations
  });

  it("should handle empty arrays", () => {
    const items: number[] = [];
    const result = safeIterate(items, () => {});

    expect(result.success).toBe(true);
  });

  it("should provide index to callback", () => {
    const items = ["a", "b", "c"];
    const indices: number[] = [];

    safeIterate(items, (_, index) => {
      indices.push(index);
    });

    expect(indices).toEqual([0, 1, 2]);
  });
});

describe("safeArrayAccess", () => {
  const testArray = [10, 20, 30, 40, 50];

  it("should return value for valid index", () => {
    const result = safeArrayAccess(testArray, 2);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(30);
    }
  });

  it("should fail for negative index", () => {
    const result = safeArrayAccess(testArray, -1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain("out of bounds");
    }
  });

  it("should fail for index beyond array length", () => {
    const result = safeArrayAccess(testArray, 5);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain("out of bounds");
    }
  });

  it("should handle zero index", () => {
    const result = safeArrayAccess(testArray, 0);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(10);
    }
  });

  it("should handle last index", () => {
    const result = safeArrayAccess(testArray, 4);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(50);
    }
  });
});

describe("safeParseInt", () => {
  it("should parse valid integer strings", () => {
    const result = safeParseInt("42");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(42);
    }
  });

  it("should parse negative integers", () => {
    const result = safeParseInt("-123");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(-123);
    }
  });

  it("should fail for non-numeric strings", () => {
    const result = safeParseInt("abc");

    expect(result.success).toBe(false);
  });

  it("should fail for unsafe integers", () => {
    const result = safeParseInt("9007199254740992"); // MAX_SAFE_INTEGER + 1

    expect(result.success).toBe(false);
  });

  it("should handle zero", () => {
    const result = safeParseInt("0");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(0);
    }
  });
});

describe("safeDivide", () => {
  it("should divide numbers correctly", () => {
    const result = safeDivide(10, 2);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(5);
    }
  });

  it("should fail for division by zero", () => {
    const result = safeDivide(10, 0);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain("Division by zero");
    }
  });

  it("should handle negative numbers", () => {
    const result = safeDivide(-10, 2);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(-5);
    }
  });

  it("should handle fractional results", () => {
    const result = safeDivide(7, 2);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(3.5);
    }
  });

  it("should fail for infinite results", () => {
    const result = safeDivide(Infinity, 1);

    expect(result.success).toBe(false);
  });
});

describe("clamp", () => {
  it("should return value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("should clamp to minimum", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("should clamp to maximum", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("should handle equal min and max", () => {
    expect(clamp(5, 10, 10)).toBe(10);
  });

  it("should handle value equal to min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("should handle value equal to max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe("FixedBuffer (Power of Ten Rule 3: No Dynamic Memory)", () => {
  it("should create buffer with specified size", () => {
    const buffer = new FixedBuffer<number>(10);

    expect(buffer.getSize()).toBe(10);
    expect(buffer.getCount()).toBe(0);
  });

  it("should add items successfully", () => {
    const buffer = new FixedBuffer<string>(5);

    const result1 = buffer.add("first");
    const result2 = buffer.add("second");

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(buffer.getCount()).toBe(2);
  });

  it("should retrieve items by index", () => {
    const buffer = new FixedBuffer<number>(5);

    buffer.add(100);
    buffer.add(200);
    buffer.add(300);

    const result = buffer.get(1);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe(200);
    }
  });

  it("should fail when buffer is full", () => {
    const buffer = new FixedBuffer<number>(3);

    buffer.add(1);
    buffer.add(2);
    buffer.add(3);

    const result = buffer.add(4);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain("Buffer is full");
    }
  });

  it("should fail for invalid get index", () => {
    const buffer = new FixedBuffer<number>(5);
    buffer.add(42);

    const result1 = buffer.get(-1);
    const result2 = buffer.get(5);

    expect(result1.success).toBe(false);
    expect(result2.success).toBe(false);
  });

  it("should fail for unoccupied slot", () => {
    const buffer = new FixedBuffer<number>(5);

    const result = buffer.get(0);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain("No value at index");
    }
  });

  it("should respect MAX_FEED_ITEMS constant", () => {
    expect(MAX_FEED_ITEMS).toBe(1000);
    expect(MAX_FEED_ITEMS).toBeLessThanOrEqual(MAX_ITERATIONS);
  });
});

describe("Constants", () => {
  it("should define MAX_ITERATIONS", () => {
    expect(MAX_ITERATIONS).toBe(10000);
  });

  it("should define MAX_FEED_ITEMS within bounds", () => {
    expect(MAX_FEED_ITEMS).toBeLessThanOrEqual(MAX_ITERATIONS);
  });
});
