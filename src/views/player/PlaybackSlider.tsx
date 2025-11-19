import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { styled } from '@mui/material/styles';

import PlaybackSliderBase from '@skybrush/mui-components/lib/PlaybackSlider';

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
import { getPlaybackSliderStepSize } from '~/features/settings/selectors';

// Styled component to position mark labels above the timeline
const StyledPlaybackSlider = styled(PlaybackSliderBase)`
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
  .MuiSlider-mark:hover + .MuiSlider-markLabel:not([data-always-visible='true']),
  .MuiSlider-markLabel:not([data-always-visible='true']):hover {
    opacity: 1;
    pointer-events: auto;
  }
  
  .MuiSlider-markLabel.staggered-up {
    top: -40px;
  }
  
  .MuiSlider-markLabel.staggered-down {
    top: -8px;
  }
  
  .MuiSlider-markLabel.rotated {
    transform: rotate(-45deg);
    transform-origin: center;
    top: -20px;
  }
`;

// Component to handle overlapping labels
const PlaybackSliderWithLabelOverlapHandling = (props: any) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current || !props.marks) return;

    const handleOverlaps = () => {
      const markLabels = sliderRef.current?.querySelectorAll('.MuiSlider-markLabel');
      if (!markLabels || markLabels.length === 0) return;

      const labels = Array.from(markLabels) as HTMLElement[];
      const marks = sliderRef.current?.querySelectorAll('.MuiSlider-mark');
      const duration = props.duration || 1;
      
      // Set data attributes for always-visible labels
      if (marks && props.marks) {
        // Create a map of mark values to mark data
        const markDataMap = new Map<number, any>();
        props.marks.forEach((markData: any) => {
          if (markData && typeof markData.value === 'number') {
            markDataMap.set(markData.value, markData);
          }
        });

        // Match labels to marks by their value
        marks.forEach((mark) => {
          const valueAttr = mark.getAttribute('aria-valuenow') || mark.getAttribute('data-value');
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
      
      // Reset all labels
      labels.forEach((label) => {
        label.classList.remove('staggered-up', 'staggered-down', 'rotated');
        label.style.top = '';
      });

      // Check for overlaps and adjust positions
      for (let i = 0; i < labels.length; i++) {
        const currentLabel = labels[i];
        if (!currentLabel.textContent) continue;

        const currentRect = currentLabel.getBoundingClientRect();
        let hasOverlap = false;

        // Check if this label overlaps with previous labels
        for (let j = 0; j < i; j++) {
          const prevLabel = labels[j];
          if (!prevLabel.textContent) continue;

          const prevRect = prevLabel.getBoundingClientRect();
          
          // Check horizontal overlap (within 100px)
          if (
            currentRect.left < prevRect.right + 5 &&
            currentRect.right > prevRect.left - 5
          ) {
            hasOverlap = true;
            break;
          }
        }

        if (hasOverlap) {
          // Stagger labels: alternate between up and down
          const staggerIndex = i % 3;
          if (staggerIndex === 1) {
            currentLabel.classList.add('staggered-up');
          } else if (staggerIndex === 2) {
            currentLabel.classList.add('staggered-down');
          } else {
            // Keep at default position for first in group
            currentLabel.classList.add('rotated');
          }
        }
      }
    };

    // Handle overlaps after a short delay to ensure labels are rendered
    const timeoutId = setTimeout(handleOverlaps, 100);
    const timeoutId2 = setTimeout(handleOverlaps, 300);

    const observer = new MutationObserver(handleOverlaps);
    if (sliderRef.current) {
      observer.observe(sliderRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style'],
      });
    }

    // Also handle on window resize
    window.addEventListener('resize', handleOverlaps);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      observer.disconnect();
      window.removeEventListener('resize', handleOverlaps);
    };
  }, [props.marks, props.duration]);

  return <StyledPlaybackSlider ref={sliderRef} {...props} />;
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
)(PlaybackSliderWithLabelOverlapHandling);
