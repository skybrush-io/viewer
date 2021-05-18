const fs = require('fs');
const { ipcRenderer: ipc } = require('electron-better-ipc');

const actionsFromRenderer = {};

const noop = () => {};

const getActionByName = (name) => {
  const func = actionsFromRenderer[name];
  if (func) {
    return func;
  }

  console.warn(`${name}() action was not provided by the renderer`);
  return noop;
};

const createActionProxy =
  (name) =>
  (...args) =>
    getActionByName(name)(...args);

module.exports = {
  receiveActionsFromRenderer: (actions) => {
    Object.assign(actionsFromRenderer, actions);
  },

  setupIpc: () => {
    ipc.answerMain(
      'notifyFileOpeningRequest',
      createActionProxy('loadShowFromLocalFile')
    );

    ipc.answerMain(
      'loadShowFromObject',
      createActionProxy('loadShowFromObject')
    );

    ipc.answerMain('setUIMode', createActionProxy('setUIMode'));
  },
};
