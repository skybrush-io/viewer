import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Folder from '@mui/icons-material/Folder';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { shouldUseWelcomeScreen } from '~/features/settings/selectors';
import { pickLocalFileAndLoadShow } from '~/features/show/actions';
import {
  canLoadShowFromLocalFile,
  hasLoadedShowFile,
  isLoadingShowFile,
  lastLoadingAttemptFailed,
} from '~/features/show/selectors';
import type { RootState } from '~/store';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { getRecentFiles } from '~/features/ui/selectors';
import { useAppSelector } from '~/hooks/store';
import CentralHelperPanel from './CentralHelperPanel';
import SkybrushLogo from './SkybrushLogo';
import RecentFileList from './recent-files/RecentFileList';

type WelcomeScreenProps = {
  readonly canLoadShowFromLocalFile: boolean;
  readonly onPickLocalFileAndLoadShow: () => void;
  readonly visible: boolean;
};

const WelcomeScreen = ({
  canLoadShowFromLocalFile,
  onPickLocalFileAndLoadShow,
  visible,
}: WelcomeScreenProps) => {
  const { t } = useTranslation();
  const recentFiles = useAppSelector(getRecentFiles);
  return (
    <CentralHelperPanel visible={visible}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <SkybrushLogo />
      </Box>
      {canLoadShowFromLocalFile && (
        <>
          {recentFiles.length > 0 && (
            <Box sx={{ mb: 4, textAlign: 'left', minWidth: 420 }}>
              <Tabs indicatorColor='primary' value='recent' centered>
                <Tab label={t('generic.recentFiles')} value='recent' />
              </Tabs>
              <RecentFileList />
            </Box>
          )}
          <Button
            size='large'
            variant='contained'
            color='primary'
            startIcon={<Folder />}
            onClick={onPickLocalFileAndLoadShow}
          >
            {t('buttons.openShowFile')}
          </Button>
        </>
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
    onPickLocalFileAndLoadShow: pickLocalFileAndLoadShow,
  }
)(WelcomeScreen);
