/**
 * Safety-Critical Utilities
 * Implements Power of Ten Rules for safe iteration and memory management
 */

import { assert, assertInRange, assertMaxLength } from "./assert";

/**
 * Maximum iterations constant (Power of Ten Rule 2)
 * All loops must have a fixed upper bound
 */
export const MAX_ITERATIONS = 10000;
export const MAX_FEED_ITEMS = 1000;
export const MAX_RESEARCH_ITEMS = 500;
export const MAX_COHORT_SIZE = 100;

/**
 * Result type for safe operations
 */
export type SafeResult<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Safe iteration with bounded loops (Rule 2)
 * @param items - Array to iterate over
 * @param callback - Function to call for each item
 * @param maxIterations - Maximum number of iterations allowed
 * @returns Result indicating success or failure
 */
export function safeIterate<T>(
  items: T[],
  callback: (item: T, index: number) => void,
  maxIterations: number = MAX_ITERATIONS
): SafeResult<void> {
  assertMaxLength(items, maxIterations, "Items exceed maximum iterations");

  let iterations = 0;
  const itemsLength = items.length;

  for (let i = 0; i < itemsLength && iterations < maxIterations; i++) {
    const item = items[i];
    if (item === undefined) {
      return {
        success: false,
        error: new Error(`Item at index ${i} is undefined`),
      };
    }

    callback(item, i);
    iterations++;
  }

  assert(iterations <= maxIterations, "Iteration exceeded maximum bound");

  return { success: true, value: undefined };
}

/**
 * Safe array access with bounds checking (Rule 9)
 */
export function safeArrayAccess<T>(array: T[], index: number): SafeResult<T> {
  if (index < 0 || index >= array.length) {
    return {
      success: false,
      error: new Error(
        `Index ${index} out of bounds for array of length ${array.length}`
      ),
    };
  }

  const value = array[index];
  if (value === undefined) {
    return {
      success: false,
      error: new Error(`Value at index ${index} is undefined`),
    };
  }

  return { success: true, value };
}

/**
 * Safe number parsing with validation
 */
export function safeParseInt(value: string): SafeResult<number> {
  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    return {
      success: false,
      error: new Error(`Failed to parse "${value}" as integer`),
    };
  }

  if (!Number.isSafeInteger(parsed)) {
    return {
      success: false,
      error: new Error(`Parsed value ${parsed} is not a safe integer`),
    };
  }

  return { success: true, value: parsed };
}

/**
 * Safe division with zero check
 */
export function safeDivide(
  numerator: number,
  denominator: number
): SafeResult<number> {
  if (denominator === 0) {
    return {
      success: false,
      error: new Error("Division by zero"),
    };
  }

  const result = numerator / denominator;

  if (!isFinite(result)) {
    return {
      success: false,
      error: new Error("Division resulted in non-finite number"),
    };
  }

  return { success: true, value: result };
}

/**
 * Clamp a value within a range (prevents overflow)
 */
export function clamp(value: number, min: number, max: number): number {
  assert(min <= max, "Min must be less than or equal to max");
  return Math.max(min, Math.min(max, value));
}

/**
 * Pre-allocated buffer for feed items (Rule 3: No dynamic allocation)
 */
interface BufferItem<T> {
  value: T | null;
  occupied: boolean;
}

export class FixedBuffer<T> {
  private buffer: BufferItem<T>[];
  private size: number;
  private count: number;

  constructor(maxSize: number) {
    assertInRange(maxSize, 1, MAX_ITERATIONS, "Buffer size out of range");
    this.size = maxSize;
    this.count = 0;

    // Pre-allocate buffer (Rule 3)
    this.buffer = new Array(maxSize);
    for (let i = 0; i < maxSize; i++) {
      this.buffer[i] = { value: null, occupied: false };
    }
  }

  public add(value: T): SafeResult<void> {
    if (this.count >= this.size) {
      return {
        success: false,
        error: new Error("Buffer is full"),
      };
    }

    // Find first unoccupied slot
    let iterations = 0;
    for (let i = 0; i < this.size && iterations < this.size; i++) {
      const slot = this.buffer[i];
      if (slot === undefined) {
        return {
          success: false,
          error: new Error(`Buffer slot ${i} is undefined`),
        };
      }

      if (!slot.occupied) {
        slot.value = value;
        slot.occupied = true;
        this.count++;
        return { success: true, value: undefined };
      }

      iterations++;
    }

    return {
      success: false,
      error: new Error("No available slot found"),
    };
  }

  public get(index: number): SafeResult<T> {
    if (index < 0 || index >= this.size) {
      return {
        success: false,
        error: new Error(`Index ${index} out of bounds`),
      };
    }

    const slot = this.buffer[index];
    if (slot === undefined) {
      return {
        success: false,
        error: new Error(`Buffer slot ${index} is undefined`),
      };
    }

    if (!slot.occupied || slot.value === null) {
      return {
        success: false,
        error: new Error(`No value at index ${index}`),
      };
    }

    return { success: true, value: slot.value };
  }

  public getCount(): number {
    return this.count;
  }

  public getSize(): number {
    return this.size;
  }
}
