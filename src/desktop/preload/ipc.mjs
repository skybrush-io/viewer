import { ipcRenderer as ipc } from 'electron-better-ipc';

/**
 * @typedef {Record<string, (...args: any[]) => unknown>} ActionMap
 */

/**
 * @type {ActionMap}
 */
const actionsFromRenderer = {};

const noop = () => {
  /* intentionally left empty */
};

/**
 * @param {string} name
 * @returns {(...args: any[]) => unknown}
 */
const getActionByName = (name) => {
  const func = actionsFromRenderer[name];
  if (func) {
    return func;
  }

  console.warn(`${name}() action was not provided by the renderer`);
  return noop;
};

/**
 * @param {string} name
 * @returns {(...args: any[]) => unknown}
 */
const createActionProxy =
  (name) =>
  (...args) => {
    // @ts-expect-error - dynamic access
    const action = getActionByName(name);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return action(...args);
  };

/**
 * @param {ActionMap} actions
 */
export const receiveActionsFromRenderer = (actions) => {
  Object.assign(actionsFromRenderer, actions);
};

export const setupIpc = () => {
  ipc.answerMain(
    'notifyFileOpeningRequest',
    createActionProxy('loadShowFromLocalFile')
  );
  ipc.answerMain('loadShowFromBuffer', createActionProxy('loadShowFromBuffer'));
  ipc.answerMain('loadShowFromObject', createActionProxy('loadShowFromObject'));
  ipc.answerMain('setUIMode', createActionProxy('setUIMode'));
};
