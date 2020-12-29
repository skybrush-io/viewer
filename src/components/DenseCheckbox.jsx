import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';

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
