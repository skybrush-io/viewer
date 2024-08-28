import React from 'react';
import { connect } from 'react-redux';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';

import {
  toggleAxes,
  toggleGrid,
  toggleLabels,
  toggleScaleLabels,
  toggleYaw,
} from '~/features/settings/actions';
import type { RootState } from '~/store';
import { useTranslation } from 'react-i18next';

interface ThreeDViewSettingTogglesProps {
  readonly onToggleAxes: () => void;
  readonly onToggleGrid: () => void;
  readonly onToggleLabels: () => void;
  readonly onToggleScaleLabels: () => void;
  readonly onToggleYaw: () => void;
  readonly scaleLabels: boolean;
  readonly showAxes: boolean;
  readonly showGrid: boolean;
  readonly showLabels: boolean;
  readonly showYaw: boolean;
}

/**
 * Sidebar drawer component for the application.
 */
const ThreeDViewSettingToggles = ({
  onToggleAxes,
  onToggleGrid,
  onToggleLabels,
  onToggleScaleLabels,
  onToggleYaw,
  scaleLabels,
  showAxes,
  showGrid,
  showLabels,
  showYaw,
}: ThreeDViewSettingTogglesProps) => {
  const { t } = useTranslation();
  return (
    <>
      <ListItem>
        <Switch
          color='primary'
          edge='start'
          checked={showAxes}
          onChange={onToggleAxes}
        />
        <ListItemText primary={t('settings.showAxes')} />
      </ListItem>

      <ListItem>
        <Switch
          color='primary'
          edge='start'
          checked={showGrid}
          onChange={onToggleGrid}
        />
        <ListItemText primary={t('settings.showGrid')} />
      </ListItem>

      <ListItem>
        <Switch
          color='primary'
          edge='start'
          checked={showLabels}
          onChange={onToggleLabels}
        />
        <ListItemText primary={t('settings.showLabels')} />
      </ListItem>

      {showLabels && (
        <ListItem>
          <Switch
            color='primary'
            edge='start'
            checked={scaleLabels}
            onChange={onToggleScaleLabels}
          />
          <ListItemText primary={t('settings.scaleLabels')} />
        </ListItem>
      )}

      <ListItem>
        <Switch
          color='primary'
          edge='start'
          checked={showYaw}
          onChange={onToggleYaw}
        />
        <ListItemText primary={t('settings.showYaw')} />
      </ListItem>
    </>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    scaleLabels: Boolean(state.settings.threeD.scaleLabels),
    showAxes: Boolean(state.settings.threeD.axes),
    showGrid: state.settings.threeD.grid !== 'none',
    showLabels: Boolean(state.settings.threeD.showLabels),
    showYaw: Boolean(state.settings.threeD.showYaw),
  }),
  // mapDispatchToProps
  {
    onToggleAxes: toggleAxes,
    onToggleGrid: toggleGrid,
    onToggleLabels: toggleLabels,
    onToggleScaleLabels: toggleScaleLabels,
    onToggleYaw: toggleYaw,
  }
)(ThreeDViewSettingToggles);
