import React from 'react';

import Checkbox from '@mui/material/Checkbox';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  root: {
    marginLeft: -3,
    marginRight: 9,
    padding: 0,
  },
});

const DenseCheckbox = (props) => {
  const classes = useStyles();
  return <Checkbox classes={classes} size='small' {...props} />;
};

export default DenseCheckbox;
