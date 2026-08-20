import {
  TransparentList,
  type TransparentListProps,
} from '@skybrush/mui-components';
import { getRecentFiles } from '~/features/ui/selectors';
import { useAppSelector } from '~/hooks/store';
import RecentFileListItem from './RecentFileListItem';

type Props = TransparentListProps;

const RecentFileList = (props: Props) => {
  const recentFiles = useAppSelector(getRecentFiles);
  return (
    <TransparentList dense {...props}>
      {recentFiles.map((rf) => (
        <RecentFileListItem key={rf} filename={rf} />
      ))}
    </TransparentList>
  );
};

export default RecentFileList;
