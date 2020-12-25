import React from 'react';

import Grid from '@material-ui/core/Grid';

import ChartPanel from './ChartPanel';

const ChartGrid = ({ ...rest }) => (
  <Grid container spacing={1} {...rest}>
    <Grid container item xs={12}>
      <ChartPanel />
    </Grid>
    <Grid container item xs={12}>
      <ChartPanel />
    </Grid>
    <Grid container item xs={12}>
      <ChartPanel />
    </Grid>
    <Grid container item xs={12}>
      <ChartPanel />
    </Grid>
  </Grid>
);

export default ChartGrid;
