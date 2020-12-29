/**
 * @file Component that shows a three-dimensional view of the drone flock.
 */

import PropTypes from 'prop-types';
import React, { Suspense, useRef } from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';

import { MODES } from '~/features/ui/modes';
import { getCurrentMode } from '~/features/ui/selectors';

import PlayerView from '~/views/player';

import PageLoadingIndicator from './PageLoadingIndicator';

const LazyValidationView = React.lazy(() =>
  import(/* webpackChunkName: "validation" */ '~/views/validation')
);

const MainTopLevelView = ({ mode }) => {
  const ref = useRef(null);

  return (
    <Box ref={ref} display='flex' flexDirection='column' height='100vh'>
      <Suspense fallback={<PageLoadingIndicator />}>
        {mode === 'player' && <PlayerView screenRef={ref} />}
        {mode === 'validation' && <LazyValidationView />}
      </Suspense>
    </Box>
  );
};

MainTopLevelView.propTypes = {
  mode: PropTypes.oneOf(MODES),
};

export default connect(
  // mapStateToProps
  (state) => ({
    mode: getCurrentMode(state),
  }),
  // mapDispatchToProps
  {}
)(MainTopLevelView);
