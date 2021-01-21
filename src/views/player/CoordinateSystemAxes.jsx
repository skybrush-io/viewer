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
const CoordinateSystemAxes = ({ leftHanded, length, lineWidth }) => (
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

CoordinateSystemAxes.propTypes = {
  leftHanded: PropTypes.bool,
  length: PropTypes.number,
  lineWidth: PropTypes.number,
};

CoordinateSystemAxes.defaultProps = {
  length: 1,
  lineWidth: 3,
};

export default memo(CoordinateSystemAxes);
