import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Folder from '@mui/icons-material/Folder';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { TransparentList } from '@skybrush/mui-components';

import { shouldUseWelcomeScreen } from '~/features/settings/selectors';
import {
  loadShowFromLocalFile,
  pickLocalFileAndLoadShow,
} from '~/features/show/actions';
import {
  canLoadShowFromLocalFile,
  hasLoadedShowFile,
  isLoadingShowFile,
  lastLoadingAttemptFailed,
} from '~/features/show/selectors';
import { getRecentFiles } from '~/features/ui/selectors';
import type { RootState } from '~/store';
import { platformPathSeparator } from '~/utils/platform';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import CentralHelperPanel from './CentralHelperPanel';
import SkybrushLogo from './SkybrushLogo';

type WelcomeScreenProps = {
  readonly canLoadShowFromLocalFile: boolean;
  readonly onLoadShowFromLocalFile: (filename: string) => void;
  readonly onPickLocalFileAndLoadShow: () => void;
  readonly recentFiles: string[];
  readonly visible: boolean;
};

const WelcomeScreen = ({
  canLoadShowFromLocalFile,
  onLoadShowFromLocalFile,
  onPickLocalFileAndLoadShow,
  recentFiles,
  visible,
}: WelcomeScreenProps) => {
  const { t } = useTranslation();
  return (
    <CentralHelperPanel visible={visible}>
      <Box textAlign='center' mb={4}>
        <SkybrushLogo />
      </Box>
      {canLoadShowFromLocalFile && (
        <>
          {recentFiles.length > 0 && (
            <Box sx={{ mb: 4, textAlign: 'left' }}>
              <Tabs indicatorColor='primary' value='recent' centered>
                <Tab label={t('generic.recentFiles')} value='recent' />
              </Tabs>
              <TransparentList dense>
                {recentFiles.map((rf) => (
                  <ListItemButton
                    key={rf}
                    onClick={() => {
                      onLoadShowFromLocalFile(rf);
                    }}
                  >
                    <ListItemText
                      primary={rf.split(platformPathSeparator).at(-1)}
                      secondary={rf
                        .split(platformPathSeparator)
                        .slice(0, -1)
                        .join(platformPathSeparator)}
                    />
                  </ListItemButton>
                ))}
              </TransparentList>
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
    recentFiles: getRecentFiles(state),
    visible:
      shouldUseWelcomeScreen() &&
      !hasLoadedShowFile(state) &&
      !isLoadingShowFile(state) &&
      !lastLoadingAttemptFailed(state),
  }),
  // mapDispatchToProps
  {
    onPickLocalFileAndLoadShow: pickLocalFileAndLoadShow,
    onLoadShowFromLocalFile: loadShowFromLocalFile,
  }
)(WelcomeScreen);
