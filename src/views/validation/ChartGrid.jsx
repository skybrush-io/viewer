import isNil from 'lodash-es/isNil';
import sumBy from 'lodash-es/sumBy';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import useResizeObserver from 'use-resize-observer';

import Box from '@mui/material/Box';
import ChartIcon from '@mui/icons-material/InsertChartOutlined';
import BackgroundHint from '~/components/BackgroundHint';
import { findPanelById } from '~/features/validation/panels';
import { getVisiblePanels } from '~/features/validation/selectors';

const style = {
  display: 'grid',
  gridTemplateColumns: 'auto',
  gap: 2,
  overflow: 'hidden',
};

const isPanelHeightValid = (panel) =>
  typeof panel.height === 'number' &&
  Number.isFinite(panel.height) &&
  panel.height > 0;

const ChartGrid = ({ visiblePanels, ...rest }) => {
  const { ref, height = 0 } = useResizeObserver();

  const panels = visiblePanels
    .map((panelId) => findPanelById(panelId))
    .filter(Boolean);
  const panelHeights = panels.map((panel) =>
    isPanelHeightValid(panel) ? panel.height : undefined
  );
  const rowCount = panels.length;
  const gap = 16;
  let flexibleRowCount = panelHeights.filter(isNil).length;

  if (flexibleRowCount === 0) {
    // No flexible rows; just treat all the rows as flexible then
    panelHeights.fill(undefined);
    flexibleRowCount = panelHeights.length;
  }

  const totalFixedHeight = sumBy(panelHeights, (value) =>
    isNil(value) ? 0 : value
  );
  const totalFlexibleHeight = Math.max(
    height - (rowCount - 1) * gap - totalFixedHeight,
    0
  );
  const flexibleRowHeight =
    flexibleRowCount > 0 ? totalFlexibleHeight / flexibleRowCount : 0;

  const children =
    height > 0
      ? panels.map((panel, index) => {
          const component = panel?.component;
          return component
            ? React.createElement(component, {
                height: isNil(panelHeights[index])
                  ? flexibleRowHeight
                  : panelHeights[index],
                key: panel.id,
              })
            : null;
        })
      : [];

  return (
    <Box ref={ref} sx={style} {...rest}>
      {children.length > 0 ? (
        children
      ) : (
        <BackgroundHint
          header='No charts selected'
          text='Select one of the chart types with the buttons in the header'
          icon={<ChartIcon />}
        />
      )}
    </Box>
  );
};

ChartGrid.propTypes = {
  visiblePanels: PropTypes.arrayOf(PropTypes.string),
};

ChartGrid.defaultProps = {
  visiblePanels: [],
};

export default connect(
  // mapStateToProps
  (state) => ({
    visiblePanels: getVisiblePanels(state),
  }),
  // mapDispatchToProps
  {}
)(ChartGrid);
