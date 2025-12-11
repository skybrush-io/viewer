import config from 'config';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import ChevronRight from '@mui/icons-material/ChevronRight';
import Box, { type BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';

import { clearLoadedShow } from '~/features/show/slice';
import { setMode } from '~/features/ui/actions';
import { UIMode } from '~/features/ui/modes';
import { togglePanelVisibility } from '~/features/validation/actions';
import { PANELS, type ValidationPanel } from '~/features/validation/panels';
import { getVisiblePanels } from '~/features/validation/selectors';
import type { AppThunk, RootState } from '~/store';

import { canReloadShow } from '~/features/playback/selectors';
import { reloadShow } from '~/features/show/actions';

import { isLoadingShowFile } from '~/features/show/selectors';
import PanelToggleChip from './PanelToggleChip';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'baseline',
    py: 1,
    '& > div': {
      m: 0.5,
    },
    '& > button': {
      m: 0.5,
    },
  },
} as const;

type ValidationHeaderProps = BoxProps & {
  readonly canReloadShow: boolean;
  readonly isLoadingShow: boolean;
  readonly onReloadShow: () => void;
  readonly onReturnToViewer: () => void;
  readonly onTogglePanel: (id: ValidationPanel) => void;
  readonly visiblePanels: ValidationPanel[];
};

const ValidationHeader = ({
  canReloadShow,
  isLoadingShow,
  onReloadShow,
  onReturnToViewer,
  onTogglePanel,
  visiblePanels,
  ...rest
}: ValidationHeaderProps) => {
  const { t } = useTranslation();
  return (
    <Box sx={styles.root} {...rest}>
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
      <Box flex='1' />
      {config.buttons.reload && (
        <Button
          color='inherit'
          disabled={!canReloadShow}
          onClick={onReloadShow}
        >
          {isLoadingShow ? t('generic.pleaseWait') : t('buttons.reloadShow')}
        </Button>
      )}
      <Button
        color='inherit'
        endIcon={<ChevronRight />}
        onClick={onReturnToViewer}
      >
        {t('buttons.returnToViewer')}
      </Button>
    </Box>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    canReloadShow: canReloadShow(state),
    isLoadingShow: isLoadingShowFile(state),
    visiblePanels: getVisiblePanels(state),
  }),
  // mapDispatchToProps
  {
    onClearLoadedShow: (): AppThunk => (dispatch) => {
      dispatch(clearLoadedShow());
      dispatch(setMode(UIMode.PLAYER));
    },
    onReloadShow: reloadShow,
    onReturnToViewer: () => setMode(UIMode.PLAYER),
    onTogglePanel: (id: ValidationPanel) => togglePanelVisibility(id),
  }
)(ValidationHeader);
