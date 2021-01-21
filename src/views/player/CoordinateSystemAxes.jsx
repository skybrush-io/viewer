import PropTypes from 'prop-types';
import React, { memo } from 'react';

const AxisColors = {
  x: '#f44',
  y: '#4f4',
  z: '#06f',
};

/**
 * Component that renders unit-length coordinate system axes at the origin.
 */
const CoordinateSystemAxes = ({ leftHanded, lineWidth }) => (
  <>
    <a-entity
      meshline={`lineWidth: ${lineWidth}; path: 0 0 0, 1 0 0; color: ${AxisColors.x}`}
    />
    <a-entity
      meshline={`lineWidth: ${lineWidth}; path: 0 0 0, 0 ${
        leftHanded ? -1 : 1
      } 0; color: ${AxisColors.y}`}
    />
    <a-entity
      meshline={`lineWidth: ${lineWidth}; path: 0 0 0, 0 0 1; color: ${AxisColors.z}`}
    />
  </>
);

CoordinateSystemAxes.propTypes = {
  leftHanded: PropTypes.bool,
  lineWidth: PropTypes.number,
};

CoordinateSystemAxes.defaultProps = {
  lineWidth: 3,
};

export default memo(CoordinateSystemAxes);
