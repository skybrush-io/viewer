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
    fs.appendFileSync(
      '/tmp/debug.txt',
      `Received actions from renderer: ${JSON.stringify(
        Object.keys(actions)
      )}\n`
    );
    Object.assign(actionsFromRenderer, actions);
  },

  setupIpc: () => {
    ipc.answerMain('notifyFileOpeningRequest', (filename) => {
      fs.appendFileSync(
        '/tmp/debug.txt',
        `Main process wants us to open ${filename}, ${JSON.stringify(
          Object.keys(actionsFromRenderer)
        )}\n`
      );

      getActionByName('loadShowFromLocalFile')(filename);
    });

    ipc.answerMain(
      'loadShowFromObject',
      createActionProxy('loadShowFromObject')
    );

    ipc.answerMain('setUIMode', createActionProxy('setUIMode'));
  },
};
