import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Folder from '@mui/icons-material/Folder';

import { shouldUseWelcomeScreen } from '~/features/settings/selectors';
import { pickLocalFileAndLoadShow } from '~/features/show/actions';
import {
  canLoadShowFromLocalFile,
  hasLoadedShowFile,
  isLoadingShowFile,
  lastLoadingAttemptFailed,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

import CentralHelperPanel from './CentralHelperPanel';
import SkybrushLogo from './SkybrushLogo';

interface WelcomeScreenProps {
  readonly canLoadShowFromLocalFile: boolean;
  readonly onLoadShowFromLocalFile: () => void;
  readonly visible: boolean;
}

const WelcomeScreen = ({
  canLoadShowFromLocalFile,
  onLoadShowFromLocalFile,
  visible,
}: WelcomeScreenProps) => {
  const { t } = useTranslation();
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
          {t('buttons.openShowFile')}
        </Button>
      )}
    </CentralHelperPanel>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    canLoadShowFromLocalFile: canLoadShowFromLocalFile(),
    visible:
      shouldUseWelcomeScreen() &&
      !hasLoadedShowFile(state) &&
      !isLoadingShowFile(state) &&
      !lastLoadingAttemptFailed(state),
  }),
  // mapDispatchToProps
  {
    onLoadShowFromLocalFile: pickLocalFileAndLoadShow,
  }
)(WelcomeScreen);
