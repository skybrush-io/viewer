import React from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useAppDispatch, useAppSelector } from '~/hooks/store';
import { getScenery } from './selectors';
import { setScenery } from './actions';

/**
 * Component for selecting the playback speed.
 */
const ScenerySelector = () => {
  const dispatch = useAppDispatch();
  const scenery = useAppSelector(getScenery);
  return (
    <FormControl fullWidth variant='filled'>
      <InputLabel id='sidebar-environment-type-label'>Scenery</InputLabel>
      <Select
        labelId='sidebar-scenery-label'
        id='sidebar-scenery-label'
        value={scenery}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          dispatch(setScenery(event));
        }}
      >
        <MenuItem value='disabled'>Disabled</MenuItem>
        <MenuItem value='auto'>Automatic</MenuItem>
        <MenuItem value='day'>Day</MenuItem>
        <MenuItem value='night'>Night</MenuItem>
        <MenuItem value='indoor'>Indoor</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ScenerySelector;
