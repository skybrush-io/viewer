import DownloadIcon from '@mui/icons-material/Download';
import UpgradeIcon from '@mui/icons-material/SystemUpdateAlt';
import UpdateIcon from '@mui/icons-material/Update';
import {
  ProgressButton,
  type ProgressButtonProps,
} from '@skybrush/mui-components';

import { useAutoUpdate } from './hooks';
import type { UpdateError } from './types';

type Props = ProgressButtonProps;

type UpdateAction = 'check' | 'download' | 'install';

const iconForAction: Record<UpdateAction, React.ReactNode> = {
  check: <UpdateIcon />,
  download: <DownloadIcon />,
  install: <UpgradeIcon />,
};

const labelForAction: Record<UpdateAction, string> = {
  check: 'Check for updates',
  download: 'Download update',
  install: 'Install update',
};

const labelForActionInProgress: Record<UpdateAction, string> = {
  check: 'Checking for updates',
  download: 'Downloading update',
  install: 'Installing update',
};

const labelForError: Record<UpdateError, string> = {
  checkFailed: 'Update check failed',
  downloadFailed: 'Download failed',
  installFailed: 'Installation failed',
};

const CheckForUpdatesButton = (props: Props) => {
  const {
    checkForUpdates,
    downloadProgress,
    error,
    installUpdate,
    isCheckingForUpdates,
    isDownloadingUpdate,
    updateAvailable,
    updateDownloaded,
    updateSupported,
  } = useAutoUpdate();
  const loading = isCheckingForUpdates || isDownloadingUpdate;
  const chosenAction = updateDownloaded
    ? 'install'
    : updateAvailable
      ? 'download'
      : 'check';

  // TODO(ntamas): localize error and label!
  const label = loading
    ? labelForActionInProgress[chosenAction]
    : error
      ? labelForError[error]
      : labelForAction[chosenAction];

  return (
    updateSupported && (
      <ProgressButton
        variant='contained'
        loadingPosition='start'
        {...props}
        startIcon={iconForAction[chosenAction]}
        loading={loading}
        onClick={chosenAction === 'install' ? installUpdate : checkForUpdates}
        progress={downloadProgress}
      >
        {label}
      </ProgressButton>
    )
  );
};

export default CheckForUpdatesButton;
