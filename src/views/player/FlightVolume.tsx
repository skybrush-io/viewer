import React from 'react';

import { red } from '@mui/material/colors';

const DEFAULT_COLOR = red[500];

type FlightVolumeProps = {
  readonly color?: string;
  readonly lineWidth?: number;
};

/**
 * Component that renders unit-length coordinate system axes at the origin.
 */
const FlightVolume = ({
  color = DEFAULT_COLOR,
  lineWidth = 5,
}: FlightVolumeProps) => (
  <a-entity
    meshline={`color: ${color}; lineWidth: ${lineWidth}; path: 0 0 0, 10 0 0, 10 10 0, 0 10 0, 0 0 0, 0 0 10, 10 0 10, 10 10 10, 0 10 10, 0 0 10, 10 0 10, 10 0 0, 10 10 0, 10 10 10, 10 0 10`}
  />
);

export default React.memo(FlightVolume);
