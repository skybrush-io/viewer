/**
 * @file Component that shows a three-dimensional view of the drone flock.
 */

import React, { Suspense, useRef, type RefObject } from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';

import { UIMode } from '~/features/ui/modes';
import { getCurrentMode } from '~/features/ui/selectors';
import type { RootState } from '~/store';
import PlayerView from '~/views/player';

import PageLoadingIndicator from './PageLoadingIndicator';

const LazyValidationView = React.lazy(
  async () => import(/* webpackChunkName: "validation" */ '~/views/validation')
);

interface MainTopLevelViewProps {
  readonly mode: UIMode;
}

const MainTopLevelView = ({ mode }: MainTopLevelViewProps) => {
  const ref: RefObject<Element> = useRef(null) as any;

  return (
    <Box ref={ref} display='flex' flexDirection='column' height='100vh'>
      <Suspense fallback={<PageLoadingIndicator />}>
        {mode === UIMode.PLAYER && <PlayerView screenRef={ref} />}
        {mode === UIMode.VALIDATION && <LazyValidationView />}
      </Suspense>
    </Box>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    mode: getCurrentMode(state),
  }),
  // mapDispatchToProps
  {}
)(MainTopLevelView);
