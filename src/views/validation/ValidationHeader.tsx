import React from 'react';
import { connect } from 'react-redux';

import Box, { type BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Close from '@mui/icons-material/Close';
import ChevronRight from '@mui/icons-material/ChevronRight';

import {
  canLoadShowFromLocalFile,
  hasLoadedShowFile,
} from '~/features/show/selectors';
import { clearLoadedShow } from '~/features/show/slice';
import { togglePanelVisibility } from '~/features/validation/actions';
import { PANELS } from '~/features/validation/panels';
import { getVisiblePanels } from '~/features/validation/selectors';
import { UIMode } from '~/features/ui/modes';
import { setMode } from '~/features/ui/slice';
import type { AppThunk, RootState } from '~/store';

import PanelToggleChip from './PanelToggleChip';

const styles = {
  root: {
    display: 'flex',
    py: 1,
    '& > div': {
      m: 0.5,
    },
    '& > button': {
      m: 0.5,
    },
  },
} as const;

interface ValidationHeaderProps extends BoxProps {
  canLoadShowFromLocalFile: boolean;
  hasLoadedShowFile: boolean;
  onClearLoadedShow: () => void;
  onReturnToViewer: () => void;
  onTogglePanel: (id: string) => void;
  visiblePanels: string[];
}

const ValidationHeader = ({
  canLoadShowFromLocalFile,
  hasLoadedShowFile,
  onClearLoadedShow,
  onReturnToViewer,
  onTogglePanel,
  visiblePanels,
  ...rest
}: ValidationHeaderProps) => (
  <Box sx={styles.root} {...rest}>
    {PANELS.map(({ component, id, ...rest }) => {
      return (
        <PanelToggleChip
          key={id}
          selected={visiblePanels.includes(id)}
          onClick={() => {
            onTogglePanel(id);
          }}
          {...rest}
        />
      );
    })}
    <Box flex='1' />
    {canLoadShowFromLocalFile && (
      <Button
        color='inherit'
        startIcon={<Close />}
        disabled={!hasLoadedShowFile}
        onClick={onClearLoadedShow}
      >
        Close show
      </Button>
    )}
    <Button
      color='inherit'
      endIcon={<ChevronRight />}
      onClick={onReturnToViewer}
    >
      Return to viewer
    </Button>
  </Box>
);

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    canLoadShowFromLocalFile: canLoadShowFromLocalFile(),
    hasLoadedShowFile: hasLoadedShowFile(state),
    visiblePanels: getVisiblePanels(state),
  }),
  // mapDispatchToProps
  {
    onClearLoadedShow: (): AppThunk => (dispatch) => {
      dispatch(clearLoadedShow());
      dispatch(setMode(UIMode.PLAYER));
    },
    onReturnToViewer: () => setMode(UIMode.PLAYER),
    onTogglePanel: (id: string) => togglePanelVisibility(id),
  }
)(ValidationHeader);
