import isNil from 'lodash-es/isNil';
import omit from 'lodash-es/omit';
import sumBy from 'lodash-es/sumBy';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { useResizeObserver } from '@mantine/hooks';

import ChartIcon from '@mui/icons-material/InsertChartOutlined';
import Box, { type BoxProps } from '@mui/material/Box';
import BackgroundHint from '@skybrush/mui-components/lib/BackgroundHint';

import {
  findPanelById,
  type PanelSpecification,
  type ValidationPanel,
} from '~/features/validation/panels';
import { getVisiblePanels } from '~/features/validation/selectors';
import type { RootState } from '~/store';

const style = {
  display: 'grid',
  gridTemplateColumns: 'auto',
  gap: 2,
  overflow: 'hidden',
};

const isPanelHeightValid = (panel: PanelSpecification): boolean =>
  typeof panel.height === 'number' &&
  Number.isFinite(panel.height) &&
  panel.height > 0;

type ChartGridProps = BoxProps & {
  readonly visiblePanels: ValidationPanel[];
};

const ChartGrid = ({ visiblePanels, ...rest }: ChartGridProps) => {
  const [ref, { height = 0 }] = useResizeObserver();
  const { t } = useTranslation();

  const panels: PanelSpecification[] = visiblePanels
    .map((panelId) => findPanelById(panelId))
    .filter((spec): spec is PanelSpecification => !isNil(spec));
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
    <Box ref={ref} sx={style} {...omit(rest, 'ref')}>
      {children.length > 0 ? (
        children
      ) : (
        <BackgroundHint
          header={t('chartGrid.noChartsHint.header')}
          text={t('chartGrid.noChartsHint.text')}
          icon={<ChartIcon />}
        />
      )}
    </Box>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    visiblePanels: getVisiblePanels(state),
  }),
  // mapDispatchToProps
  {}
)(ChartGrid);
