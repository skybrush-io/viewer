import merge from 'lodash-es/merge';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';

import Card from '@material-ui/core/Card';
import { orange } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

import {
  createChartStyle,
  createGradientBackground,
  createSecondaryAreaStyle,
  isThemeDark,
} from '@skybrush/app-theme-material-ui';

import { CHART_COLORS } from '~/features/validation/constants';
import { formatPlaybackTimestamp } from '~/utils/formatters';

require('chartjs-plugin-annotation');
require('chartjs-plugin-crosshair');

const useStyles = makeStyles(
  (theme) => {
    const isDark = isThemeDark(theme);

    return {
      root: {
        ...createSecondaryAreaStyle(theme),
        position: 'relative',

        '& .reset-zoom': {
          position: 'absolute',
          top: theme.spacing(2),
          right: theme.spacing(2),

          cursor: 'pointer',

          ...theme.typography.button,
          borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(1, 2),
          transition: theme.transitions.create(
            ['background-color', 'box-shadow', 'border-color', 'color'],
            {
              duration: theme.transitions.duration.short,
            }
          ),
          color: theme.palette.getContrastText(
            theme.palette.grey[isDark ? 800 : 300]
          ),
          backgroundColor: theme.palette.grey[isDark ? 800 : 300],
          boxShadow: theme.shadows[4],
          border: 'none',
        },

        '& .reset-zoom:hover': {
          textDecoration: 'none',
          backgroundColor: isDark
            ? theme.palette.grey[700]
            : theme.palette.text.primary,
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: 'transparent',
          },
        },
      },
    };
  },
  {
    name: 'ChartPanel',
  }
);

const createLineStyle = ({ canvas, color = 'rgb(0, 128, 255)' } = {}) => ({
  backgroundColor: createGradientBackground({
    alpha: 0.4,
    height: 450,
    canvas,
    color,
  }),
  borderColor: color,
  pointBackgroundColor: color,
});

const createLineStyles = (options) => {
  return CHART_COLORS.map((color) => createLineStyle({ ...options, color }));
};

const createThresholdAnnotation = (value, label) => ({
  type: 'line',
  mode: 'horizontal',
  scaleID: 'left',
  value,
  borderColor: orange[500],
  borderDash: [10, 5],
  borderWidth: 2,
  label: {
    backgroundColor: orange[500],
    content: label,
    fontColor: 'rgba(0, 0, 0, 0.54)',
    enabled: Boolean(label),
    position: 'left',
    xAdjust: 16,
  },
});

const createOptions = ({
  threshold,
  thresholdIsAbsolute,
  thresholdLabel,
  verticalUnit,
} = {}) => {
  const base = createChartStyle({
    animate: false,
    dark: true,
    rotateTickLabels: false,
    showPoints: false,
    smoothing: false,
  });

  const options = {
    legend: {
      labels: {
        usePointStyle: true,
      },
    },

    plugins: {
      crosshair: {
        line: {
          color: 'rgb(0, 128, 255)',
          width: 1,
        },
        sync: {
          // Performance is not good yet if sync is enabled
          enabled: false,
          group: 1,
          suppressTooltips: false,
        },
        zoom: {
          enabled: true,
          zoomboxBackgroundColor: 'rgba(0, 128, 255, 0.2)',
          zoomboxBorderColor: 'rgb(0, 128, 255)',
          zoomButtonText: 'Reset Zoom',
        },
      },
    },

    scales: {
      xAxes: [
        {
          ticks: {
            callback(value) {
              return formatPlaybackTimestamp(value);
            },
          },
        },
      ],
    },

    tooltips: {
      callbacks: {
        label: (item, data) => {
          let label = data.datasets[item.datasetIndex].label || '';

          if (label) {
            label += ': ';
          }

          label += Math.round(item.yLabel * 100) / 100;
          return label + verticalUnit;
        },
      },
      intersect: false,
      mode: 'index',
    },
  };

  if (typeof threshold === 'number' && Number.isFinite(threshold)) {
    const annotations = [createThresholdAnnotation(threshold, thresholdLabel)];
    if (thresholdIsAbsolute) {
      annotations.push(createThresholdAnnotation(-threshold, thresholdLabel));
    }

    options.annotation = { annotations };
  }

  return merge(base, options);
};

const ChartPanel = ({
  data,
  height,
  threshold,
  thresholdIsAbsolute,
  thresholdLabel,
  verticalUnit,
}) => {
  const classes = useStyles();

  const chartData = useMemo(
    () => (canvas) => {
      const lineStyles = createLineStyles({ canvas });
      const numberStyles = lineStyles.length;

      const datasets = [];
      const index = 0;
      let styleIndex = 0;

      for (const dataset of data || []) {
        if (dataset) {
          const isBoundary =
            dataset.role === 'minimum' || dataset.role === 'maximum';

          datasets.push({
            label: dataset.label || `Series ${index + 1}`,
            data: dataset.values,
            fill: dataset.role === 'minimum' ? '+1' : false,
            showLine: true,
            interpolate: true,
            ...lineStyles[styleIndex % numberStyles],
            borderWidth: isBoundary ? 1 : 2,
          });

          if (!isBoundary) {
            styleIndex++;
          }
        }
      }

      return {
        datasets,
      };
    },
    [data]
  );

  const options = useMemo(
    () =>
      createOptions({
        threshold,
        thresholdIsAbsolute,
        thresholdLabel,
        verticalUnit,
      }),
    [threshold, thresholdIsAbsolute, thresholdLabel, verticalUnit]
  );

  return (
    <Card square className={classes.root} style={{ height }}>
      <Scatter data={chartData} options={options} />
    </Card>
  );
};

ChartPanel.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      values: PropTypes.arrayOf(
        PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })
      ),
      label: PropTypes.string,
      role: PropTypes.oneOf(['minimum', 'maximum', 'mean', 'single']),
    })
  ),
  height: PropTypes.number,
  threshold: PropTypes.number,
  thresholdIsAbsolute: PropTypes.bool,
  thresholdLabel: PropTypes.string,
  verticalUnit: PropTypes.string,
};

ChartPanel.defaultProps = {
  verticalUnit: '',
};

export default ChartPanel;
