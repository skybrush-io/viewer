import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect } from 'react-redux';

import { hasLoadedShowFile, getShowTitle } from '~/features/show/selectors';

const WindowTitleManager = ({ appName, showTitle }) => {
  useEffect(() => {
    if (window && window.bridge && window.bridge.isElectron) {
      // Running inside Electron, use the bridge API to ask the renderer
      // process to change the window title.
      window.bridge.setTitle({ appName });
    } else {
      // Running inside the browser, set the title of the document
      document.title = showTitle ? `${showTitle} | ${appName}` : appName;
    }
  }, [appName, showTitle]);

  return null;
};

WindowTitleManager.propTypes = {
  appName: PropTypes.string,
  loading: PropTypes.bool,
};

export default connect(
  // mapStateToProps
  (state) => ({
    showTitle: hasLoadedShowFile(state) ? getShowTitle(state) : '',
  }),
  // mapDispatchToProps
  {}
)(WindowTitleManager);
