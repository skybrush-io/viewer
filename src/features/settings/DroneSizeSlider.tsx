import React from 'react';

import Slider, { type SliderProps } from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import { setDroneSize } from '~/features/settings/actions';
import { getDroneSize } from '~/features/settings/selectors';
import { useAppDispatch, useAppSelector } from '~/hooks/store';

type DroneSizeSliderProps = SliderProps;

/**
 * Slider that allows the user to set the sizes of the drones on the UI.
 */
const DroneSizeSlider = (props: DroneSizeSliderProps) => {
  const droneSize = useAppSelector(getDroneSize);
  const dispatch = useAppDispatch();

  return (
    <>
      <Typography gutterBottom>Drone size</Typography>
      <Slider
        id='sidebar-drone-size'
        value={droneSize}
        valueLabelDisplay='auto'
        min={0.1}
        max={2}
        step={0.05}
        onChange={(event, value: number) => {
          dispatch(setDroneSize(value));
        }}
      />
    </>
  );
};

export default DroneSizeSlider;
