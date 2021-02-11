const { ipcRenderer: ipc } = require('electron-better-ipc');

module.exports = () => {
  ipc.answerMain('dispatch', (arg) => {
    window.bridge.dispatch(arg);
  });

  ipc.answerMain('loadShowSpecification', (showSpec) => {
    const {
      dispatch,
      actions: { requestToLoadShow },
    } = window.bridge;
    dispatch(requestToLoadShow(showSpec));
  });

  ipc.answerMain('setUIMode', (mode) => {
    const {
      dispatch,
      actions: { setUIMode },
    } = window.bridge;
    dispatch(setUIMode(mode));
  });
};
