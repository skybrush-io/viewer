import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRight from '@material-ui/icons/ChevronRight';

import { togglePanelVisibility } from '~/features/validation/actions';
import { getVisiblePanels } from '~/features/validation/selectors';
import { setMode } from '~/features/ui/slice';

import PanelToggleChip from './PanelToggleChip';
import { PANELS } from './panels';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: theme.spacing(1, 0),
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const ValidationHeader = ({
  onReturnToViewer,
  onTogglePanel,
  visiblePanels,
}) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
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
      <Button
        color='primary'
        endIcon={<ChevronRight />}
        onClick={onReturnToViewer}
      >
        Return to viewer
      </Button>
    </Box>
  );
};

ValidationHeader.propTypes = {
  onReturnToViewer: PropTypes.func,
  onTogglePanel: PropTypes.func,
  visiblePanels: PropTypes.arrayOf(PropTypes.string),
};

export default connect(
  // mapStateToProps
  (state) => ({
    visiblePanels: getVisiblePanels(state),
  }),
  // mapDispatchToProps
  (dispatch) => ({
    onReturnToViewer: () => dispatch(setMode('player')),
    onTogglePanel: (id) => dispatch(togglePanelVisibility(id)),
  })
)(ValidationHeader);
