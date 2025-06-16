import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import LCDText from '~/components/LCDText';
import {
  getElapsedSecondsGetter,
  isPlaying,
} from '~/features/playback/selectors';
import { useAppSelector } from '~/hooks/store';
import {
  formatPlaybackTimestamp,
  formatPlaybackTimestampAsFrames,
} from '~/utils/formatters';
import usePeriodicRefresh from '~/hooks/usePeriodicRefresh';
import { getSimulatedPlaybackFrameRate } from '~/features/settings/selectors';

export default function PlayheadSection() {
  const theme = useTheme();
  const { t } = useTranslation();
  const playing = useAppSelector(isPlaying);
  const fps = useAppSelector(getSimulatedPlaybackFrameRate);
  const getElapsedSeconds = useAppSelector(getElapsedSecondsGetter);

  // Format the timestamp as milliseconds
  /*
  const formattedTime = formatPlaybackTimestamp(getElapsedSeconds(), {
    digits: 3,
  }).padStart(9, '0');
  */

  // Format the timestamp as frames
  const formattedTime = formatPlaybackTimestampAsFrames(
    getElapsedSeconds(),
    fps
  ).padStart(8, '0');

  usePeriodicRefresh(playing ? 50 : null);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <LCDText
        height={64}
        textAlign='center'
        variant='14segment'
        decoration='shadow'
        color={theme.palette.primary.main}
        offSegments
      >
        {formattedTime}
      </LCDText>
    </Box>
  );
}
