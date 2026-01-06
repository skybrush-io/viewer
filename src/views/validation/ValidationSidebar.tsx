import { t } from 'i18next';
import isNil from 'lodash-es/isNil';
import type React from 'react';
import { connect } from 'react-redux';
import { List, type RowComponentProps } from 'react-window';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
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

type SidebarListItemPresentationProps = {
  readonly chartIndex: number | undefined;
  readonly label?: string;
  readonly onToggleSelection: () => void;
  readonly style?: React.CSSProperties;
};

const SidebarListItemPresentation = ({
  chartIndex,
  label,
  onToggleSelection,
  style,
}: SidebarListItemPresentationProps) => (
  <ListItemButton dense style={style} onClick={onToggleSelection}>
    <Checkbox
      checked={!isNil(chartIndex)}
      size='small'
      style={{ color: chartIndex ? CHART_COLORS[chartIndex] : undefined }}
    />
    <ListItemText primary={label} />
  </ListItemButton>
);

const SidebarListItem = connect(
  // mapStateToProps
  (state: RootState, ownProps: { id: string }) => ({
    chartIndex: getSelectionToChartIndexMapping(state)[ownProps.id],
  }),
  // mapDispatchToProps
  (dispatch: AppDispatch, ownProps: { id: string }) => ({
    onToggleSelection() {
      dispatch(toggleItemInSelection(ownProps.id));
    },
  })
)(SidebarListItemPresentation);

const ShowAllDronesListItem = connect(
  // mapStateToProps
  (state: RootState) => ({
    chartIndex: isSelectionEmpty(state) ? 0 : undefined,
    label: t('validation.allDrones'),
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

type ValidationSidebarProps = {
  readonly singleDroneItems: Array<{ id: string; label: string }>;
  readonly width?: number;
};

type ValidationSidebarRowProps = RowComponentProps<{
  singleDroneItems: ValidationSidebarProps['singleDroneItems'];
}>;

const ValidationSidebarRow = ({
  index,
  singleDroneItems,
  style,
}: ValidationSidebarRowProps) => {
  const item = index > 0 ? singleDroneItems[index - 1] : undefined;
  return item ? (
    <SidebarListItem key={item.id} {...item} style={style} />
  ) : (
    <ShowAllDronesListItem style={style} />
  );
};

const ValidationSidebar = ({
  singleDroneItems,
  width = 160,
}: ValidationSidebarProps) => {
  return (
    <Box width={width} sx={style}>
      <List
        rowHeight={36}
        rowCount={singleDroneItems.length + 1}
        rowComponent={ValidationSidebarRow}
        rowProps={{ singleDroneItems }}
      />
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
