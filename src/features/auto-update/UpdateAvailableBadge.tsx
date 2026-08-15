import { Colors } from '@skybrush/app-theme-mui';
import { SidebarBadge, type SidebarBadgeProps } from '@skybrush/mui-components';

import { useAutoUpdate } from './hooks';

type Props = SidebarBadgeProps;

/**
 * Badge that appears if and only if an update is currently available and waiting to
 * be installed.
 */
const UpdateAvailableBadge = (props: Props) => {
  const { updateAvailable } = useAutoUpdate();
  return (
    <SidebarBadge color={Colors.info} {...props} visible={updateAvailable} />
  );
};

export default UpdateAvailableBadge;
