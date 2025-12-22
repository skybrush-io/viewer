import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Folder from '@mui/icons-material/Folder';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { MiniList, MiniListItemButton } from '@skybrush/mui-components';

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
              <Typography
                variant='subtitle1'
                color='textSecondary'
                sx={{ pl: 1, textTransform: 'uppercase' }}
              >
                {t('generic.recentFiles')}
              </Typography>
              <MiniList>
                {recentFiles.map((rf) => (
                  <MiniListItemButton
                    key={rf}
                    gap={2}
                    inset={1}
                    onClick={() => {
                      onLoadShowFromLocalFile(rf);
                    }}
                    // TODO: Truncate these using `text-overflow: ellipsis`?
                    primaryText={rf.split('/').at(-1)}
                    secondaryText={rf.split('/').slice(0, -1).join('/')}
                  />
                ))}
              </MiniList>
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
