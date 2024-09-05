import React from 'react';
import { useTranslation } from 'react-i18next';

import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import { setDroneRadius } from '~/features/settings/actions';
import { getRawDroneRadiusSetting } from '~/features/settings/selectors';
import { useAppDispatch, useAppSelector } from '~/hooks/store';

const labelFormatter = (value: number) => `${value}x`;

/**
 * Slider that allows the user to set the sizes of the drones on the UI.
 */
const DroneSizeSlider = () => {
  const droneRadius = useAppSelector(getRawDroneRadiusSetting);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <>
      <Typography gutterBottom>{t('settings.droneRadius')}</Typography>
      <Slider
        id='sidebar-drone-radius'
        value={droneRadius}
        valueLabelDisplay='auto'
        valueLabelFormat={labelFormatter}
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
