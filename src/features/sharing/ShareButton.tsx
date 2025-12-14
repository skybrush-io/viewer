import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Share from '@mui/icons-material/Share';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@skybrush/mui-components/lib/Tooltip';

import { hasLoadedShowFile } from '~/features/show/selectors';
import type { RootState } from '~/store';
import { getSharingLink } from './actions';

const ShareButton = (props: IconButtonProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip content={t('buttons.shareLink')}>
      <IconButton disableRipple {...props} size='large'>
        <Share />
      </IconButton>
    </Tooltip>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    disabled: !hasLoadedShowFile(state),
  }),
  // mapDispatchToProps
  {
    onClick: getSharingLink,
  }
)(ShareButton);
