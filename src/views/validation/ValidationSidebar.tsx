import isNil from 'lodash-es/isNil';
import React from 'react';
import { connect } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import useResizeObserver from 'use-resize-observer';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import {
  clearSelection,
  toggleItemInSelection,
} from '~/features/validation/actions';
import { CHART_COLORS } from '~/features/validation/constants';
import { getSidebarItemsForSingleDrones } from '~/features/validation/items';
import {
  getSelectionToChartIndexMapping,
  isSelectionEmpty,
} from '~/features/validation/selectors';
import type { AppDispatch, RootState } from '~/store';

interface SidebarListItemPresentationProps {
  readonly chartIndex: number;
  readonly label?: string;
  readonly onToggleSelection: () => void;
  readonly style?: React.CSSProperties;
}

const SidebarListItemPresentation = ({
  chartIndex,
  label,
  onToggleSelection,
  style,
}: SidebarListItemPresentationProps) => (
  <ListItem button dense style={style} onClick={onToggleSelection}>
    <Checkbox
      checked={!isNil(chartIndex)}
      size='small'
      style={{ color: chartIndex ? CHART_COLORS[chartIndex] : undefined }}
    />
    <ListItemText primary={label} />
  </ListItem>
);

const SidebarListItem = connect(
  // mapStateToProps
  (state: RootState, ownProps: { id: string }) => ({
    chartIndex: getSelectionToChartIndexMapping(state)[ownProps.id],
  }),
  // mapDispatchToProps
  (dispatch: AppDispatch, ownProps: { id: string }) => ({
    onToggleSelection() {
      dispatch(toggleItemInSelection(ownProps.id) as any);
    },
  })
)(SidebarListItemPresentation);

const ShowAllDronesListItem = connect(
  // mapStateToProps
  (state: RootState) => ({
    chartIndex: isSelectionEmpty(state) ? 0 : undefined,
    label: 'All drones',
  }),
  {
    onToggleSelection: clearSelection,
  }
)(SidebarListItemPresentation);

const style = {
  '& .MuiCheckbox-root': {
    marginLeft: '-3px',
    marginRight: '9px',
    padding: 0,
  },
};

interface ValidationSidebarProps {
  readonly singleDroneItems: Array<{ id: string; label: string }>;
  readonly width?: number;
}

const ValidationSidebar = ({
  singleDroneItems,
  width = 160,
}: ValidationSidebarProps) => {
  const { ref, height = 0 } = useResizeObserver();
  return (
    <Box ref={ref} width={width} sx={style}>
      <List
        height={height}
        width={width}
        itemSize={36}
        itemCount={singleDroneItems.length + 1}
      >
        {({ index, style }) => {
          const item = index > 0 ? singleDroneItems[index - 1] : undefined;
          return index === 0 ? (
            <ShowAllDronesListItem style={style} />
          ) : item ? (
            <SidebarListItem key={item.id} {...item} style={style} />
          ) : null;
        }}
      </List>
    </Box>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    singleDroneItems: getSidebarItemsForSingleDrones(state),
  }),
  // mapDispatchToProps
  {}
)(ValidationSidebar);
