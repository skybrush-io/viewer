import { connect } from 'react-redux';

import CameraSelectorChip from '~/components/CameraSelectorChip';
import { getPerspectiveCamerasAndDefaultCamera } from '~/features/show/selectors';
import { switchToCameraByIndex } from '~/features/three-d/actions';
import { getSelectedCameraIndex } from '~/features/three-d/selectors';

export default connect(
  // mapStateToProps
  (state) => ({
    cameras: getPerspectiveCamerasAndDefaultCamera(state),
    selectedCameraIndex: getSelectedCameraIndex(state),
  }),
  // mapDispatchToProps
  {
    onCameraSelected: switchToCameraByIndex,
  }
)(CameraSelectorChip);
