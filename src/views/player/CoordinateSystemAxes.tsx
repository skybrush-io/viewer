import * as React from 'react';

const AxisColors = {
  x: '#f44',
  y: '#4f4',
  z: '#06f',
} as const;

interface CoordinateSystemAxesProps {
  leftHanded?: boolean;
  length?: number;
  lineWidth?: number;
}

/**
 * Component that renders unit-length coordinate system axes at the origin.
 */
const CoordinateSystemAxes = ({
  leftHanded = false,
  length = 1,
  lineWidth = 3,
}: CoordinateSystemAxesProps) => (
  <>
    <a-entity
      meshline={`lineWidth: ${lineWidth}; path: 0 0 0, ${length} 0 0; color: ${AxisColors.x}`}
    />
    <a-entity
      meshline={`lineWidth: ${lineWidth}; path: 0 0 0, 0 ${
        leftHanded ? -length : length
      } 0; color: ${AxisColors.y}`}
    />
    <a-entity
      meshline={`lineWidth: ${lineWidth}; path: 0 0 0, 0 0 ${length}; color: ${AxisColors.z}`}
    />
  </>
);

export default React.memo(CoordinateSystemAxes);
