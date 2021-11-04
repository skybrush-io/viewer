import isNil from 'lodash-es/isNil';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import useResizeObserver from 'use-resize-observer';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import DenseCheckbox from '~/components/DenseCheckbox';
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

const SidebarListItemPresentation = ({
  chartIndex,
  label,
  onToggleSelection,
  style,
}) => (
  <ListItem button dense style={style} onClick={onToggleSelection}>
    <DenseCheckbox
      checked={!isNil(chartIndex)}
      style={{ color: chartIndex ? CHART_COLORS[chartIndex] : undefined }}
    />
    <ListItemText primary={label} />
  </ListItem>
);

SidebarListItemPresentation.propTypes = {
  chartIndex: PropTypes.number,
  label: PropTypes.string,
  onToggleSelection: PropTypes.func,
  style: PropTypes.any,
};

const SidebarListItem = connect(
  // mapStateToProps
  (state, ownProps) => ({
    chartIndex: getSelectionToChartIndexMapping(state)[ownProps.id],
  }),
  // mapDispatchToProps
  (dispatch, ownProps) => ({
    onToggleSelection: () => {
      dispatch(toggleItemInSelection(ownProps.id));
    },
  })
)(SidebarListItemPresentation);

const ShowAllDronesListItem = connect(
  // mapStateToProps
  (state) => ({
    chartIndex: isSelectionEmpty(state) ? 0 : undefined,
    label: 'All drones',
  }),
  {
    onToggleSelection: clearSelection,
  }
)(SidebarListItemPresentation);

const ValidationSidebar = ({ singleDroneItems, width }) => {
  const { ref, height = 0 } = useResizeObserver();
  return (
    <Box ref={ref} width={width}>
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
          ) : (
            <SidebarListItem key={item.id} {...item} style={style} />
          );
        }}
      </List>
    </Box>
  );
};

ValidationSidebar.propTypes = {
  singleDroneItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  width: PropTypes.number,
};

ValidationSidebar.defaultProps = {
  width: 160,
};

export default connect(
  // mapStateToProps
  (state) => ({
    singleDroneItems: getSidebarItemsForSingleDrones(state),
  }),
  // mapDispatchToProps
  {}
)(ValidationSidebar);
