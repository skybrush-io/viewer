import { useTranslation } from 'react-i18next';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useAppDispatch, useAppSelector } from '~/hooks/store';

import { setSimulatedPlaybackFrameRate } from './actions';
import { getSimulatedPlaybackFrameRate } from './selectors';

/**
 * Component for selecting the number of simulated frames per second on the
 * playback slider.
 */
const FrameRateSelector = () => {
  const dispatch = useAppDispatch();
  const speed = useAppSelector(getSimulatedPlaybackFrameRate);
  const { t } = useTranslation();
  return (
    <FormControl fullWidth variant='filled'>
      <InputLabel id='sidebar-playback-frame-rate-label'>
        {t('settings.playbackFrameRate')}
      </InputLabel>
      <Select
        labelId='sidebar-playback-frame-rate-label'
        id='sidebar-playback-frame-rate'
        value={speed}
        onChange={(event) => {
          const speed = Number.parseFloat(String(event.target.value));
          dispatch(setSimulatedPlaybackFrameRate(speed));
        }}
      >
        <MenuItem value='1'>1</MenuItem>
        <MenuItem value='4'>4</MenuItem>
        <MenuItem value='5'>5</MenuItem>
        <MenuItem value='10'>10</MenuItem>
        <MenuItem value='24'>24</MenuItem>
        <MenuItem value='25'>25</MenuItem>
        <MenuItem value='30'>30</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FrameRateSelector;
