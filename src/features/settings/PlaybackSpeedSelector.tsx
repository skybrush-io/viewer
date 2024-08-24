import React from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { setPlaybackSpeed } from '~/features/playback/actions';
import { getPlaybackSpeed } from '~/features/playback/selectors';
import { useAppDispatch, useAppSelector } from '~/hooks/store';

/**
 * Component for selecting the playback speed.
 */
const PlaybackSpeedSelector = () => {
  const dispatch = useAppDispatch();
  const speed = useAppSelector(getPlaybackSpeed);
  return (
    <FormControl fullWidth variant='filled'>
      <InputLabel id='sidebar-playback-speed-label'>Playback speed</InputLabel>
      <Select
        labelId='sidebar-playback-speed-label'
        id='sidebar-playback-speed'
        value={speed}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const speed = Number.parseFloat(event.target.value);
          dispatch(setPlaybackSpeed(speed));
        }}
      >
        <MenuItem value='1'>1x</MenuItem>
        <MenuItem value='2'>2x</MenuItem>
        <MenuItem value='3'>3x</MenuItem>
        <MenuItem value='5'>5x</MenuItem>
        <MenuItem value='10'>10x</MenuItem>
      </Select>
    </FormControl>
  );
};

export default PlaybackSpeedSelector;
