import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Folder from '@material-ui/icons/Folder';

import { shouldUseWelcomeScreen } from '~/features/settings/selectors';
import { loadShowFromLocalFile } from '~/features/show/actions';
import {
  canLoadShowFromLocalFile,
  hasLoadedShowFile,
  isLoadingShowFile,
} from '~/features/show/selectors';

import CentralHelperPanel from './CentralHelperPanel';
import SkybrushLogo from './SkybrushLogo';

const useStyles = makeStyles(
  {
    root: {
      position: 'relative',
      display: 'inline-block',
    },

    progress: {
      position: 'absolute',
      top: -4,
      left: -4,
      zIndex: 1,
    },
  },
  {
    name: 'LoadingScreen',
  }
);

const WelcomeScreen = ({
  canLoadShowFromLocalFile,
  onLoadShowFromLocalFile,
  visible,
}) => {
  // const classes = useStyles();
  return (
    <CentralHelperPanel visible={visible}>
      <Box textAlign='center' mb={4}>
        <SkybrushLogo />
      </Box>
      {canLoadShowFromLocalFile && (
        <Button
          size='large'
          variant='contained'
          color='primary'
          startIcon={<Folder />}
          onClick={onLoadShowFromLocalFile}
        >
          Open show file
        </Button>
      )}
    </CentralHelperPanel>
  );
};

WelcomeScreen.propTypes = {
  canLoadShowFromLocalFile: PropTypes.bool,
  onLoadShowFromLocalFile: PropTypes.func,
  visible: PropTypes.bool,
};

export default connect(
  // mapStateToProps
  (state) => ({
    canLoadShowFromLocalFile: canLoadShowFromLocalFile(state),
    visible:
      shouldUseWelcomeScreen(state) &&
      !hasLoadedShowFile(state) &&
      !isLoadingShowFile(state),
  }),
  // mapDispatchToProps
  {
    onLoadShowFromLocalFile: loadShowFromLocalFile,
  }
)(WelcomeScreen);
