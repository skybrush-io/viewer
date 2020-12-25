/**
 * Returns whether there is at least one validation message in the message store.
 */
export const hasValidationMessages = (state) =>
  state?.validation?.messages?.order &&
  state.validation.messages.order.length > 0;
