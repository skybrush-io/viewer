import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { styled } from '@mui/material/styles';

import type { PlaybackSliderProps } from '@skybrush/mui-components';
import { PlaybackSlider as PlaybackSliderBase } from '@skybrush/mui-components';

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
  type MarkData,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

// Styled component to position mark labels above the timeline
const StyledPlaybackSlider = styled(PlaybackSliderBase)`
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

  /* Always visible labels for regular cues */
  .MuiSlider-markLabel[data-always-visible='true'] {
    opacity: 1;
    pointer-events: auto;
  }

  /* Hover-only labels for pyro cues */
  .MuiSlider-mark:hover
    + .MuiSlider-markLabel:not([data-always-visible='true']),
  .MuiSlider-markLabel:not([data-always-visible='true']):hover {
    opacity: 1;
    pointer-events: auto;
  }
`;

// Component to set data attributes for always-visible labels
const PlaybackSliderWithLabelAttributes = (props: PlaybackSliderProps) => {
  const sliderRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!sliderRef.current || !props.marks) {
      return;
    }

    // Set data attributes for always-visible labels
    const marks = sliderRef.current?.querySelectorAll('.MuiSlider-mark');
    if (marks && Array.isArray(props.marks)) {
      // Create a map of mark values to mark data
      const markDataMap = new Map<number, MarkData>(
        props.marks
          .filter((mark) => typeof mark?.value === 'number')
          .map((mark) => [mark.value, mark])
      );

      // Match labels to marks by their value
      marks.forEach((mark) => {
        const valueAttr =
          mark.getAttribute('aria-valuenow') || mark.getAttribute('data-value');
        if (valueAttr) {
          const value = parseFloat(valueAttr);
          const markData = markDataMap.get(value);
          if (markData && markData.alwaysVisible) {
            // Find the corresponding label (next sibling or nearby)
            const label = mark.nextElementSibling as HTMLElement;
            if (label && label.classList.contains('MuiSlider-markLabel')) {
              label.setAttribute('data-always-visible', 'true');
            }
          }
        }
      });
    }
  }, [props.marks]);

  // NOTE: This will not work, as as `mui-components` is still on
  //       React 18 and `PlaybackSlider` does not have `forwardRef`...
  return <StyledPlaybackSlider ref={sliderRef as any} {...props} />;
};

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
)(PlaybackSliderWithLabelAttributes);
