import PropTypes from 'prop-types';
import { useEffect } from 'react';

const WindowTitleManager = ({ appName }) => {
  useEffect(() => {
    if (window && window.bridge && window.bridge.isElectron) {
      // Running inside Electron, use the bridge API to ask the renderer
      // process to change the window title
    } else {
      // Running inside the browser, set the title of the document
      document.title = appName;
    }
  }, [appName]);

  return null;
};

WindowTitleManager.propTypes = {
  appName: PropTypes.string,
  loading: PropTypes.bool,
};

export default WindowTitleManager;
