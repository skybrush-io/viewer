import { useEffect } from 'react';
import { connect } from 'react-redux';

import { hasLoadedShowFile, getShowTitle } from '~/features/show/selectors';
import { isElectronWindow } from '~/window';

import type { RootState } from '~/store';

interface WindowTitleManagerProps {
  readonly appName: string;
  readonly showTitle: string;
}

const WindowTitleManager = ({
  appName,
  showTitle,
}: WindowTitleManagerProps) => {
  useEffect(() => {
    if (isElectronWindow(window)) {
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

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    showTitle: hasLoadedShowFile(state) ? getShowTitle(state) : '',
  }),
  // mapDispatchToProps
  {}
)(WindowTitleManager);
