import UpgradeIcon from '@mui/icons-material/SystemUpdateAlt';
import UpdateIcon from '@mui/icons-material/Update';
import Button, { type ButtonProps } from '@mui/material/Button';

import { useAutoUpdate } from './hooks';

type Props = ButtonProps;

const CheckForUpdatesButton = (props: Props) => {
  const {
    checkForUpdates,
    installUpdate,
    isCheckingForUpdates,
    supported,
    updateAvailable,
  } = useAutoUpdate();

  return (
    supported && (
      <Button
        variant='contained'
        {...props}
        startIcon={updateAvailable ? <UpgradeIcon /> : <UpdateIcon />}
        loading={isCheckingForUpdates}
        loadingPosition='start'
        onClick={updateAvailable ? installUpdate : checkForUpdates}
      >
        {updateAvailable ? 'Install update' : 'Check for updates'}
      </Button>
    )
  );
};

export default CheckForUpdatesButton;
