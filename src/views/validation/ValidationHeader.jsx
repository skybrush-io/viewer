import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
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
import { setMode } from '~/features/ui/slice';

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
};

const ValidationHeader = ({
  canLoadShowFromLocalFile,
  hasLoadedShowFile,
  onClearLoadedShow,
  onReturnToViewer,
  onTogglePanel,
  visiblePanels,
  ...rest
}) => (
  <Box sx={styles.root} {...rest}>
    {PANELS.map(({ component, id, ...rest }) => {
      return (
        <PanelToggleChip
          key={id}
          selected={visiblePanels.includes(id)}
          onClick={() => onTogglePanel(id)}
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

ValidationHeader.propTypes = {
  canLoadShowFromLocalFile: PropTypes.bool,
  hasLoadedShowFile: PropTypes.bool,
  onClearLoadedShow: PropTypes.func,
  onReturnToViewer: PropTypes.func,
  onTogglePanel: PropTypes.func,
  visiblePanels: PropTypes.arrayOf(PropTypes.string),
};

export default connect(
  // mapStateToProps
  (state) => ({
    canLoadShowFromLocalFile: canLoadShowFromLocalFile(),
    hasLoadedShowFile: hasLoadedShowFile(state),
    visiblePanels: getVisiblePanels(state),
  }),
  // mapDispatchToProps
  (dispatch) => ({
    onClearLoadedShow: () => {
      dispatch(clearLoadedShow());
      dispatch(setMode('player'));
    },
    onReturnToViewer: () => dispatch(setMode('player')),
    onTogglePanel: (id) => dispatch(togglePanelVisibility(id)),
  })
)(ValidationHeader);
