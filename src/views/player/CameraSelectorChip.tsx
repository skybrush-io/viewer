import { connect } from 'react-redux';

import CameraSelectorChip from '~/components/CameraSelectorChip';
import { getPerspectiveCamerasAndDefaultCamera } from '~/features/show/selectors';
import { switchToCameraByIndex } from '~/features/three-d/actions';
import { getSelectedCameraIndex } from '~/features/three-d/selectors';
import { cameraTriggerActions, keyMap } from '~/features/hotkeys/keymap';
import type { RootState } from '~/store';

const getFirstSequence = (keyMapItem: {
  sequence?: string;
  sequences?: string[];
}) => {
  if ('sequence' in keyMapItem) {
    return keyMapItem.sequence;
  }
  if (
    'sequences' in keyMapItem &&
    Array.isArray(keyMapItem.sequences) &&
    keyMapItem.sequences.length > 0
  ) {
    return keyMapItem.sequences![0];
  }
};

const HOTKEYS = cameraTriggerActions.map(
  (action) => getFirstSequence(keyMap[action]) ?? ''
);

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
