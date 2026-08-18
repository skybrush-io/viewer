import DownloadIcon from '@mui/icons-material/Download';
import UpgradeIcon from '@mui/icons-material/SystemUpdateAlt';
import UpdateIcon from '@mui/icons-material/Update';
import {
  ProgressButton,
  type ProgressButtonProps,
} from '@skybrush/mui-components';

import { useAutoUpdate } from './hooks';
import { defaultTranslation, type TFunction } from './i18n';
import type { UpdateAction } from './types';

type Props = ProgressButtonProps & { t?: TFunction };

const iconForAction: Record<UpdateAction, React.ReactNode> = {
  check: <UpdateIcon />,
  download: <DownloadIcon />,
  install: <UpgradeIcon />,
};

const CheckForUpdatesButton = ({ t = defaultTranslation, ...props }: Props) => {
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
  const label = t(
    loading
      ? `${chosenAction}InProgress`
      : error
        ? `${chosenAction}Error`
        : chosenAction
  );
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
