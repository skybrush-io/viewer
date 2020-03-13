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
  notifyAudioSeeking
} from '~/features/audio/slice';
import { isPlaying } from '~/features/playback/selectors';

const AudioController = ({
  muted,
  onCanPlay,
  onLoadedMetadata,
  onSeeked,
  onSeeking,
  playing,
  url
}) => {
  const audioRef = useRef(null);
  const { addToast } = useToasts();
  const onError = useCallback(() => {
    addToast('Error while playing audio; playback stopped.');
  }, [addToast]);

  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing]);

  return url ? (
    <audio
      ref={audioRef}
      muted={muted}
      preload="auto"
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
  muted: PropTypes.bool,
  onCanPlay: PropTypes.func,
  onLoadedMetadata: PropTypes.func,
  onSeeking: PropTypes.func,
  onSeeked: PropTypes.func,
  playing: PropTypes.bool,
  url: PropTypes.string
};

export default connect(
  // mapStateToProps
  state => ({
    ...state.audio,
    playing: isPlaying(state)
  }),
  // mapDispatchToProps
  {
    onCanPlay: notifyAudioCanPlay,
    onLoadedMetadata: notifyAudioMetadataLoaded,
    onSeeking: notifyAudioSeeking,
    onSeeked: notifyAudioSeeked
  }
)(AudioController);
