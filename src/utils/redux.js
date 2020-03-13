/**
 * @file Redux-related utility functions.
 */

export function noPayload(func) {
  return {
    prepare: () => ({}),
    reducer: func
  };
}

export function stripEvent(func) {
  return (event, ...args) => func(...args);
}
