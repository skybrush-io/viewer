import PropTypes from 'prop-types';
import React from 'react';

import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    borderStyle: 'solid',
    borderWidth: '1px',
    cursor: 'pointer',
  },
});

const PanelToggleChip = ({ selected, ...rest }) => {
  const classes = useStyles();
  return (
    <Chip
      clickable
      className={classes.root}
      color={selected ? 'primary' : 'default'}
      variant={selected ? 'default' : 'outlined'}
      {...rest}
    />
  );
};

PanelToggleChip.propTypes = {
  selected: PropTypes.bool,
};

export default PanelToggleChip;
