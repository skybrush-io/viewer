import { connect } from 'react-redux';

import CameraSelectorChip from '~/components/CameraSelectorChip';
import { getPerspectiveCamerasAndDefaultCamera } from '~/features/show/selectors';
import { switchToCameraByIndex } from '~/features/three-d/actions';
import { getSelectedCameraIndex } from '~/features/three-d/selectors';
import { cameraTriggerActions, keyMap } from '~/hotkeys';
import type { RootState } from '~/store';

const HOTKEYS = cameraTriggerActions.map((action) => keyMap[action]);

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    cameras: getPerspectiveCamerasAndDefaultCamera(state),
    hotkeys: HOTKEYS,
    selectedCameraIndex: getSelectedCameraIndex(state),
  }),
  // mapDispatchToProps
  {
    onCameraSelected: switchToCameraByIndex,
  }
)(CameraSelectorChip);
