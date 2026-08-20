import ListItemButton, {
  type ListItemButtonProps,
} from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import { useEffect, useState } from 'react';
import { loadShowFromLocalFile } from '~/features/show/actions';
import { useAppDispatch } from '~/hooks/store';
import { platformPathSeparator } from '~/utils/platform';
import { getElectronBridge } from '~/window';

type Props = ListItemButtonProps & {
  filename: string;
};

const splitFilename = (filename: string) => {
  const parts = filename.split(platformPathSeparator);
  return {
    primary: parts.at(-1),
    secondary: parts.slice(0, -1).join(platformPathSeparator),
  };
};

const checkFileExists = async (filename: string): Promise<boolean> => {
  const bridge = getElectronBridge();
  if (!bridge) {
    return false;
  }

  try {
    return await bridge.fileExists(filename);
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
};

const useFileExists = (filename: string) => {
  const [exists, setExists] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let ignore = false;

    checkFileExists(filename).then(
      (result) => {
        if (!ignore) {
          setExists(result);
        }
      },
      () => {
        if (!ignore) {
          setExists(false);
        }
      }
    );

    return () => {
      ignore = true;
    };
  }, [filename]);

  return exists;
};

const RecentFileListItem = ({ filename, ...rest }: Props) => {
  const dispatch = useAppDispatch();
  const labels = splitFilename(filename);
  const exists = useFileExists(filename);

  if (exists === false) {
    // Don't render the item if the file doesn't exist
    return null;
  } else if (exists) {
    // Render the item if the file exists
    return (
      <ListItemButton
        onClick={() => {
          dispatch(loadShowFromLocalFile(filename));
        }}
        {...rest}
      >
        <ListItemText {...labels} />
      </ListItemButton>
    );
  } else {
    // Render a skeleton while checking if the file exists
    return (
      <Skeleton>
        <ListItemButton disabled {...rest}>
          <ListItemText {...labels} />
        </ListItemButton>
      </Skeleton>
    );
  }
};

export default RecentFileListItem;
