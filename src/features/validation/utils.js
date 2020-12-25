/**
 * Removes all messages from the state slice corresponding to the validation
 * reducer.
 */
export function removeAllMessages(state) {
  state.messages.byId = {};
  state.messages.order = [];
}
