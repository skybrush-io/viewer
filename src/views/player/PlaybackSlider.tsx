import { connect } from 'react-redux';

import PlaybackSlider from '@skybrush/mui-components/lib/PlaybackSlider';

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
    step: 0.04, // 25 fps
    shiftStep: 0.04, // 25 fps
  }),
  // mapDispatchToProps
  {
    onDragged: (event: any, value: number | number[]) =>
      setPlaybackPosition(Array.isArray(value) ? value[0] : value),
    onDragging: (event: any, value: number | number[]) =>
      temporarilyOverridePlaybackPosition(
        Array.isArray(value) ? value[0] : value
      ),
  }
)(PlaybackSlider);
