import PropTypes from 'prop-types';
import React from 'react';

import Chip from '@mui/material/Chip';

const style = {
  borderStyle: 'solid',
  borderWidth: '1px',
  cursor: 'pointer',
};

const PanelToggleChip = ({ selected, ...rest }) => (
  <Chip
    clickable
    color={selected ? 'primary' : 'default'}
    variant={selected ? 'default' : 'outlined'}
    sx={style}
    {...rest}
  />
);

PanelToggleChip.propTypes = {
  selected: PropTypes.bool,
};

export default PanelToggleChip;
