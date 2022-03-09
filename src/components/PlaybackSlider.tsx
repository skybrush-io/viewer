import React from 'react';
import { connect } from 'react-redux';
import { useHarmonicIntervalFn, useUpdate } from 'react-use';

import Slider from '@mui/material/Slider';
import { orange } from '@mui/material/colors';
import { styled, Theme } from '@mui/material/styles';

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

const styles = ({ theme }: { theme: Theme }) => ({
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: theme.palette.primary.main,
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },

  '& .MuiSlider-mark': {
    height: 4,
    width: 4,
    backgroundColor: orange[500],
    transform: 'translateY(-1px)',
    '&.MuiSlider-markActive': {
      opacity: 1,
    },
  },
});

interface PlaybackSliderProps {
  dragging: boolean;
  duration: number;
  formatPlaybackTimestamp: (timestamp: number) => string;
  getElapsedSeconds: () => number;
  onDragged: (event: Event, value: number) => void;
  onDragging: (event: Event, value: number) => void;
  playing: boolean;
  updateInterval?: number;
}

const PlaybackSlider = ({
  dragging,
  duration,
  formatPlaybackTimestamp,
  getElapsedSeconds,
  onDragged,
  onDragging,
  playing,
  updateInterval = 200,
  ...rest
}: PlaybackSliderProps) => {
  const update = useUpdate();
  useHarmonicIntervalFn(update, playing && !dragging ? updateInterval : null);

  const elapsed = Math.min(getElapsedSeconds(), duration);

  return (
    <Slider
      max={duration}
      size='small'
      value={elapsed}
      valueLabelDisplay='auto'
      valueLabelFormat={formatPlaybackTimestamp}
      onChange={onDragging}
      onChangeCommitted={onDragged}
      {...rest}
    />
  );
};

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
)(styled(PlaybackSlider)(styles));
