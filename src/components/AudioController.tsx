/**
 * @file Component that controls the audio playback synchronized to the
 * visuals.
 */

import { useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { connect } from 'react-redux';

import {
  notifyAudioCanPlay,
  notifyAudioMetadataLoaded,
  notifyAudioSeeked,
  notifyAudioSeeking,
} from '~/features/audio/slice';
import { getCurrentAudioStartTime } from '~/features/audio/selectors';
import {
  getElapsedSecondsGetter,
  isAdjustingPlaybackPosition,
  isPlayingInRealTime,
} from '~/features/playback/selectors';
import type { RootState } from '~/store';

type AudioControllerProps = {
  readonly elapsedSecondsGetter: () => number;
  readonly muted: boolean;
  readonly onCanPlay: () => void;
  readonly onLoadedMetadata: () => void;
  readonly onSeeked: () => void;
  readonly onSeeking: () => void;
  readonly playing: boolean;
  readonly startTime: number;
  readonly url?: string;
};

const AudioController = ({
  elapsedSecondsGetter,
  muted,
  onCanPlay,
  onLoadedMetadata,
  onSeeked,
  onSeeking,
  playing,
  startTime,
  url,
}: AudioControllerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>(null);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  const onError = useCallback(() => {
    toast.error('Error while playing audio; playback stopped.');

    if (audioRef?.current) {
      console.error(audioRef.current.error);
    }
  }, [audioRef]);

  // Effect that takes care of stopping / starting the audio and re-syncing the
  // playback position when needed
  const tryPlayAudio = useCallback(() => {
    if (!audioRef.current || !playingRef.current) {
      return;
    }
    const currentTime = elapsedSecondsGetter() - startTime;
    if (currentTime >= 0) {
      // TODO(ntamas): there is a hardcoded delay between the audio and the
      // visuals. I don't know why it's needed or whether it varies from
      // machine to machine. We need to test it.
      audioRef.current.currentTime = currentTime + 0.15;
      audioRef.current.play().catch(() => {});
    } else {
      const delay = Math.min(5000, -currentTime * 1000);
      timeoutIdRef.current = setTimeout(tryPlayAudio, delay);
    }
  }, [elapsedSecondsGetter, startTime]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (playing) {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      const currentTime = elapsedSecondsGetter() - startTime;
      const delay = currentTime >= 0 ? 0 : -currentTime * 1000;
      timeoutIdRef.current = setTimeout(tryPlayAudio, delay);
    } else {
      audioRef.current.pause();
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, [playing, startTime, tryPlayAudio, elapsedSecondsGetter]);

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

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    ...state.audio,
    elapsedSecondsGetter: getElapsedSecondsGetter(state),
    playing: isPlayingInRealTime(state) && !isAdjustingPlaybackPosition(state),
    startTime: getCurrentAudioStartTime(state),
  }),
  // mapDispatchToProps
  {
    onCanPlay: notifyAudioCanPlay,
    onLoadedMetadata: notifyAudioMetadataLoaded,
    onSeeking: notifyAudioSeeking,
    onSeeked: notifyAudioSeeked,
  }
)(AudioController);
