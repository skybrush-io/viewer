import config from 'config';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import ChevronLeft from '@mui/icons-material/ChevronLeft';
import Link from '@mui/icons-material/Link';
import Refresh from '@mui/icons-material/Refresh';
import Box, { type BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import { Tooltip } from '@skybrush/mui-components';

import { toggleSyncCharts } from '~/features/settings/actions';
import { shouldSynchronizeValidationCharts } from '~/features/settings/selectors';
import { setMode } from '~/features/ui/actions';
import { UIMode } from '~/features/ui/modes';
import { togglePanelVisibility } from '~/features/validation/actions';
import { PANELS, type ValidationPanel } from '~/features/validation/panels';
import { getVisiblePanels } from '~/features/validation/selectors';
import type { RootState } from '~/store';

import { canReloadShow } from '~/features/playback/selectors';
import { reloadShow } from '~/features/show/actions';

import { isLoadingShowFile } from '~/features/show/selectors';
import PanelToggleChip from './PanelToggleChip';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    py: 1,
    '& > div': {
      m: 0.5,
    },
    '& > button': {
      flexShrink: 0,
      m: 0.5,
    },
  },
  chips: {
    display: 'flex',
    flex: 1,
    gap: 1,
    minWidth: 0,
    overflowX: 'auto',
    scrollbarWidth: 'thin',
    '& > *': {
      flexShrink: 0,
    },
  },
} as const;

type ValidationHeaderProps = BoxProps & {
  readonly canReloadShow: boolean;
  readonly isLoadingShow: boolean;
  readonly onReloadShow: () => void;
  readonly onReturnToViewer: () => void;
  readonly onTogglePanel: (id: ValidationPanel) => void;
  readonly onToggleSyncCharts: () => void;
  readonly syncCharts: boolean;
  readonly visiblePanels: ValidationPanel[];
};

const ValidationHeader = ({
  canReloadShow,
  isLoadingShow,
  onReloadShow,
  onReturnToViewer,
  onTogglePanel,
  onToggleSyncCharts,
  syncCharts,
  visiblePanels,
  ...rest
}: ValidationHeaderProps) => {
  const { t } = useTranslation();
  return (
    <Box sx={styles.root} {...rest}>
      <Box sx={styles.chips}>
        {PANELS.map(({ component, id, ...rest }) => {
          return (
            <PanelToggleChip
              key={id}
              label={t(`validation.${id}`)}
              selected={visiblePanels.includes(id)}
              onClick={() => {
                onTogglePanel(id);
              }}
              {...rest}
            />
          );
        })}
      </Box>
      <Tooltip content={t('validation.syncCharts')}>
        <ToggleButton
          aria-label={t('validation.syncCharts')}
          size='small'
          value='syncCharts'
          selected={syncCharts}
          onChange={onToggleSyncCharts}
          sx={{ border: 'none' }} // `ToggleButton` doesn't seem to have variants
        >
          <Link />
        </ToggleButton>
      </Tooltip>
      {config.buttons.reload && (
        <Tooltip
          content={
            isLoadingShow ? t('generic.pleaseWait') : t('buttons.reloadShow')
          }
        >
          <IconButton
            aria-label={t('buttons.reloadShow')}
            color='inherit'
            disabled={!canReloadShow}
            onClick={onReloadShow}
          >
            {isLoadingShow ? (
              <CircularProgress color='inherit' size={24} />
            ) : (
              <Refresh />
            )}
          </IconButton>
        </Tooltip>
      )}
      <Tooltip content={t('buttons.returnToViewer')}>
        <Button
          color='inherit'
          startIcon={<ChevronLeft />}
          onClick={onReturnToViewer}
        >
          {t('buttons.back')}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    canReloadShow: canReloadShow(state),
    isLoadingShow: isLoadingShowFile(state),
    syncCharts: shouldSynchronizeValidationCharts(state),
    visiblePanels: getVisiblePanels(state),
  }),
  // mapDispatchToProps
  {
    /*
    onClearLoadedShow: (): AppThunk => (dispatch) => {
      dispatch(clearLoadedShow());
      dispatch(setMode(UIMode.PLAYER));
    },
    */
    onReloadShow: reloadShow,
    onReturnToViewer: () => setMode(UIMode.PLAYER),
    onTogglePanel: (id: ValidationPanel) => togglePanelVisibility(id),
    onToggleSyncCharts: toggleSyncCharts,
  }
)(ValidationHeader);
