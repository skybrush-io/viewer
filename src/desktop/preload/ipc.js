const { ipcRenderer: ipc } = require('electron-better-ipc');

const actionsFromRenderer = {};

module.exports = {
  receiveActionsFromRenderer: (actions) => {
    Object.assign(actionsFromRenderer, actions);
  },

  setupIpc: () => {
    ipc.answerMain('loadShowSpecification', (showSpec) => {
      const { requestToLoadShow: func } = actionsFromRenderer;
      if (func) {
        func(showSpec);
      } else {
        console.warn(
          'requestToLoadShow() action was not provided by the renderer'
        );
      }
    });

    ipc.answerMain('setUIMode', (mode) => {
      const { func } = actionsFromRenderer;
      if (func) {
        func(mode);
      } else {
        console.warn('setUIMode() action was not provided by the renderer');
      }
    });
  },
};
