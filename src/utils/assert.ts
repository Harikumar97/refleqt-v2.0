/**
 * Safety-Critical Assertion Utilities
 * Implements Power of Ten Rule 5: Minimum 2 assertions per function
 *
 * These utilities provide runtime validation and error handling
 * for safety-critical code paths.
 */

/**
 * Assertion error class for tracking assertion failures
 */
export class AssertionError extends Error {
  constructor(
    message: string,
    public readonly context?: unknown
  ) {
    super(message);
    this.name = "AssertionError";
    Error.captureStackTrace(this, AssertionError);
  }
}

/**
 * Core assertion function that validates conditions
 * @param condition - Boolean condition to check
 * @param message - Error message if assertion fails
 * @throws {AssertionError} When condition is false
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    const error = new AssertionError(`Assertion failed: ${message}`);
    console.error(error.message);
    throw error;
  }
}

/**
 * Assert that a value is defined (not null or undefined)
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message: string
): asserts value is T {
  assert(value !== null && value !== undefined, message);
}

/**
 * Assert that a number is within a valid range
 */
export function assertInRange(
  value: number,
  min: number,
  max: number,
  message: string
): void {
  assert(
    value >= min && value <= max,
    `${message} (value: ${value}, range: [${min}, ${max}])`
  );
}

/**
 * Assert that an array has a maximum length (bounds checking)
 */
export function assertMaxLength<T>(
  array: T[],
  maxLength: number,
  message: string
): void {
  assert(
    array.length <= maxLength,
    `${message} (length: ${array.length}, max: ${maxLength})`
  );
}

/**
 * Assert that a string is non-empty
 */
export function assertNonEmptyString(
  value: string,
  message: string
): asserts value is string {
  assert(typeof value === "string" && value.length > 0, message);
}

/**
 * Type guard with assertion
 */
export function assertType<T>(
  value: unknown,
  typeName: string,
  validator: (value: unknown) => value is T
): asserts value is T {
  assert(validator(value), `Value must be of type ${typeName}`);
}

/**
 * Safe integer assertion (prevents floating point issues)
 */
export function assertSafeInteger(value: number, message: string): void {
  assert(Number.isSafeInteger(value), `${message} (value: ${value})`);
}

/**
 * Assert array index is valid (bounds checking)
 */
export function assertValidIndex<T>(
  array: T[],
  index: number,
  message: string
): void {
  assertSafeInteger(index, "Index must be a safe integer");
  assert(
    index >= 0 && index < array.length,
    `${message} (index: ${index}, length: ${array.length})`
  );
}
