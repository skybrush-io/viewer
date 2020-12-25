import React from 'react';

import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  {
    root: {
      flex: 1,
    },
  },
  {
    name: 'ChartPanel',
  }
);

const ChartPanel = () => {
  const classes = useStyles();
  return <Card className={classes.root}>foo</Card>;
};

export default ChartPanel;
