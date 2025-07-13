import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Box, { type BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Refresh from '@mui/icons-material/Refresh';

import { clearLoadedShow } from '~/features/show/slice';
import { togglePanelVisibility } from '~/features/validation/actions';
import { PANELS, type ValidationPanel } from '~/features/validation/panels';
import { getVisiblePanels } from '~/features/validation/selectors';
import { setMode } from '~/features/ui/actions';
import { UIMode } from '~/features/ui/modes';
import type { AppThunk, RootState } from '~/store';

import { canReloadShow } from '~/features/playback/selectors';
import { reloadShow } from '~/features/show/actions';

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

interface ValidationHeaderProps extends BoxProps {
  readonly canReloadShow: boolean;
  readonly onReloadShow: () => void;
  readonly onReturnToViewer: () => void;
  readonly onTogglePanel: (id: ValidationPanel) => void;
  readonly visiblePanels: ValidationPanel[];
}

const ValidationHeader = ({
  canReloadShow,
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
      {canReloadShow && (
        <Button color='inherit' onClick={onReloadShow}>
          {t('buttons.reloadShow')}
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
