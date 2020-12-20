/**
 * @file Component that controls the audio playback synchronized to the
 * visuals.
 */

import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useToasts } from 'react-toast-notifications';

import {
  notifyAudioCanPlay,
  notifyAudioMetadataLoaded,
  notifyAudioSeeked,
  notifyAudioSeeking,
} from '~/features/audio/slice';
import {
  getElapsedSecondsGetter,
  isAdjustingPlaybackPosition,
  isPlayingInRealTime,
} from '~/features/playback/selectors';

const AudioController = ({
  elapsedSecondsGetter,
  muted,
  onCanPlay,
  onLoadedMetadata,
  onSeeked,
  onSeeking,
  playing,
  url,
}) => {
  const audioRef = useRef(null);
  const { addToast } = useToasts();
  const onError = useCallback(() => {
    addToast('Error while playing audio; playback stopped.', {
      appearance: 'error',
    });

    if (audioRef) {
      console.error(audioRef.current.error);
    }
  }, [addToast, audioRef]);

  // Effect that takes care of stopping / starting the audio and re-syncing the
  // playback position when needed
  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        // TODO(ntamas): there is a hardcoded delay between the audio and the
        // visuals. I don't know why it's needed or whether it varies from
        // machine to machine. We need to test it.
        audioRef.current.currentTime = elapsedSecondsGetter() + 0.15;
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [elapsedSecondsGetter, playing]);

  return url ? (
    <audio
      ref={audioRef}
      muted={muted}
      preload='auto'
      src={url}
      onCanPlay={onCanPlay}
      onError={onError}
      onLoadedMetadata={onLoadedMetadata}
      onSeeking={onSeeking}
      onSeeked={onSeeked}
    />
  ) : null;
};

AudioController.propTypes = {
  elapsedSecondsGetter: PropTypes.func,
  muted: PropTypes.bool,
  onCanPlay: PropTypes.func,
  onLoadedMetadata: PropTypes.func,
  onSeeking: PropTypes.func,
  onSeeked: PropTypes.func,
  playing: PropTypes.bool,
  url: PropTypes.string,
};

export default connect(
  // mapStateToProps
  (state) => ({
    ...state.audio,
    elapsedSecondsGetter: getElapsedSecondsGetter(state),
    playing: isPlayingInRealTime(state) && !isAdjustingPlaybackPosition(state),
  }),
  // mapDispatchToProps
  {
    onCanPlay: notifyAudioCanPlay,
    onLoadedMetadata: notifyAudioMetadataLoaded,
    onSeeking: notifyAudioSeeking,
    onSeeked: notifyAudioSeeked,
  }
)(AudioController);
