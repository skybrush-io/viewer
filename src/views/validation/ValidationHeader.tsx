import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Box, { type BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Close from '@mui/icons-material/Close';
import ChevronRight from '@mui/icons-material/ChevronRight';

import {
  canLoadShowFromLocalFile,
  hasLoadedShowFile,
} from '~/features/show/selectors';
import { clearLoadedShow } from '~/features/show/slice';
import { togglePanelVisibility } from '~/features/validation/actions';
import { PANELS, type ValidationPanel } from '~/features/validation/panels';
import { getVisiblePanels } from '~/features/validation/selectors';
import { setMode } from '~/features/ui/actions';
import { UIMode } from '~/features/ui/modes';
import type { AppThunk, RootState } from '~/store';

import PanelToggleChip from './PanelToggleChip';

const styles = {
  root: {
    display: 'flex',
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
  readonly canLoadShowFromLocalFile: boolean;
  readonly hasLoadedShowFile: boolean;
  readonly onClearLoadedShow: () => void;
  readonly onReturnToViewer: () => void;
  readonly onTogglePanel: (id: ValidationPanel) => void;
  readonly visiblePanels: ValidationPanel[];
}

const ValidationHeader = ({
  canLoadShowFromLocalFile,
  hasLoadedShowFile,
  onClearLoadedShow,
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
      {canLoadShowFromLocalFile && (
        <Button
          color='inherit'
          startIcon={<Close />}
          disabled={!hasLoadedShowFile}
          onClick={onClearLoadedShow}
        >
          {t('buttons.closeShow')}
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
    canLoadShowFromLocalFile: canLoadShowFromLocalFile(),
    hasLoadedShowFile: hasLoadedShowFile(state),
    visiblePanels: getVisiblePanels(state),
  }),
  // mapDispatchToProps
  {
    onClearLoadedShow: (): AppThunk => (dispatch) => {
      dispatch(clearLoadedShow());
      dispatch(setMode(UIMode.PLAYER));
    },
    onReturnToViewer: () => setMode(UIMode.PLAYER),
    onTogglePanel: (id: ValidationPanel) => togglePanelVisibility(id),
  }
)(ValidationHeader);
