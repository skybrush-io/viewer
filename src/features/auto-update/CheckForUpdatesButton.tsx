import DownloadIcon from '@mui/icons-material/Download';
import UpgradeIcon from '@mui/icons-material/SystemUpdateAlt';
import UpdateIcon from '@mui/icons-material/Update';
import Button, { type ButtonProps } from '@mui/material/Button';

import { useAutoUpdate } from './hooks';

type Props = ButtonProps;

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

const CheckForUpdatesButton = (props: Props) => {
  const {
    checkForUpdates,
    installUpdate,
    isCheckingForUpdates,
    isDownloadingUpdate,
    updateAvailable,
    updateDownloaded,
    updateSupported,
  } = useAutoUpdate();
  const chosenAction = updateDownloaded
    ? 'install'
    : updateAvailable && !isDownloadingUpdate
      ? 'download'
      : 'check';

  return (
    updateSupported && (
      <Button
        variant='contained'
        {...props}
        startIcon={iconForAction[chosenAction]}
        loading={isCheckingForUpdates || isDownloadingUpdate}
        loadingPosition='start'
        onClick={chosenAction === 'install' ? installUpdate : checkForUpdates}
      >
        {labelForAction[chosenAction]}
      </Button>
    )
  );
};

export default CheckForUpdatesButton;
