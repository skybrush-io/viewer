import isNil from 'lodash-es/isNil';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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
}) => (
  <ListItem button dense onClick={onToggleSelection}>
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

const ValidationSidebar = ({ singleDroneItems }) => {
  return (
    <Box width={160} overflow='auto'>
      <List dense style={{ background: 'transparent' }}>
        <ShowAllDronesListItem />
        {singleDroneItems.map((item) => (
          <SidebarListItem key={item.id} {...item} />
        ))}
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
};

export default connect(
  // mapStateToProps
  (state) => ({
    singleDroneItems: getSidebarItemsForSingleDrones(state),
  }),
  // mapDispatchToProps
  {}
)(ValidationSidebar);
