import { connect } from 'react-redux';

import PlaybackSlider from '@skybrush/mui-components/lib/PlaybackSlider';
import { stripEvent } from '@skybrush/redux-toolkit';

import {
  setPlaybackPosition,
  temporarilyOverridePlaybackPosition,
} from '~/features/playback/actions';
import {
  getElapsedSecondsGetter,
  isAdjustingPlaybackPosition,
  isPlaying,
} from '~/features/playback/selectors';
import {
  getMarksFromShowCues,
  getShowDuration,
  getTimestampFormatter,
} from '~/features/show/selectors';

import type { RootState } from '~/store';

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    dragging: isAdjustingPlaybackPosition(state),
    duration: getShowDuration(state),
    formatPlaybackTimestamp: getTimestampFormatter(state),
    getElapsedSeconds: getElapsedSecondsGetter(state),
    marks: getMarksFromShowCues(state),
    playing: isPlaying(state),
  }),
  // mapDispatchToProps
  {
    onDragged: stripEvent(setPlaybackPosition),
    onDragging: stripEvent(temporarilyOverridePlaybackPosition),
  }
)(PlaybackSlider);
