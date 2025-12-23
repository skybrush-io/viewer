import { connect } from 'react-redux';

import { styled } from '@mui/material/styles';

import { PlaybackSlider } from '@skybrush/mui-components';

import {
  setPlaybackPosition,
  temporarilyOverridePlaybackPosition,
} from '~/features/playback/actions';
import {
  getElapsedSecondsGetter,
  isAdjustingPlaybackPosition,
  isPlaying,
} from '~/features/playback/selectors';
import { getPlaybackSliderStepSize } from '~/features/settings/selectors';
import {
  getMarksFromShowCues,
  getShowDuration,
  getTimestampFormatter,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

// Styled component to position mark labels above the timeline
const StyledPlaybackSlider = styled(PlaybackSlider)`
  & {
    margin-bottom: 0;
  }

  .MuiSlider-markLabel {
    top: -24px;
    bottom: auto;
    white-space: nowrap;
    font-size: 0.75rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease-in-out;
  }

  .MuiSlider-mark:hover + .MuiSlider-markLabel,
  .MuiSlider-markLabel:hover {
    opacity: 1;
    pointer-events: auto;
  }
`;

export default connect(
  // mapStateToProps
  (state: RootState) => {
    const step = getPlaybackSliderStepSize(state);
    return {
      dragging: isAdjustingPlaybackPosition(state),
      duration: getShowDuration(state),
      formatPlaybackTimestamp: getTimestampFormatter(state),
      getElapsedSeconds: getElapsedSecondsGetter(state),
      marks: getMarksFromShowCues(state),
      playing: isPlaying(state),
      step,
      shiftStep: step,
    };
  },
  // mapDispatchToProps
  {
    onDragged: (event: any, value: number | number[]) =>
      setPlaybackPosition(Array.isArray(value) ? value[0] : value),
    onDragging: (event: any, value: number | number[]) =>
      temporarilyOverridePlaybackPosition(
        Array.isArray(value) ? value[0] : value
      ),
  }
)(StyledPlaybackSlider);
