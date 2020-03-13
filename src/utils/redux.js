/**
 * @file Redux-related utility functions.
 */

export function noPayload(func) {
  return {
    prepare: () => ({}),
    reducer: func
  };
}
