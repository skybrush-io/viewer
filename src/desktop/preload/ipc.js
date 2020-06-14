const { ipcRenderer: ipc } = require('electron-better-ipc');

module.exports = () => {
  ipc.answerMain('dispatch', (arg) => {
    window.bridge.dispatch(arg);
  });
};
