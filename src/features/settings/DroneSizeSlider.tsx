import React from 'react';

import Slider, { type SliderProps } from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import { setDroneRadius } from '~/features/settings/actions';
import { getDroneRadius } from '~/features/settings/selectors';
import { useAppDispatch, useAppSelector } from '~/hooks/store';

type DroneSizeSliderProps = SliderProps;

/**
 * Slider that allows the user to set the sizes of the drones on the UI.
 */
const DroneSizeSlider = (props: DroneSizeSliderProps) => {
  const droneRadius = useAppSelector(getDroneRadius);
  const dispatch = useAppDispatch();

  return (
    <>
      <Typography gutterBottom>UAV size</Typography>
      <Slider
        id='sidebar-drone-radius'
        value={droneRadius}
        valueLabelDisplay='auto'
        min={0.1}
        max={2}
        step={0.05}
        onChange={(event, value: number | number[]) => {
          const radius = Array.isArray(value) ? value[0] : value;
          if (radius !== undefined) {
            dispatch(setDroneRadius(radius));
          }
        }}
      />
    </>
  );
};

export default DroneSizeSlider;
