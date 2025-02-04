import merge from 'lodash-es/merge';
import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';

import Box from '@mui/material/Box';
import Card, { type CardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { orange } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

import {
  createChartStyle,
  createGradientBackground,
  createSecondaryAreaStyle,
  isThemeDark,
} from '@skybrush/app-theme-mui';

import { CHART_COLORS } from './constants';

import 'chartjs-plugin-annotation';
import 'chartjs-plugin-crosshair';

interface StyledCardProps extends CardProps {
  height: number;
}

const StyledCard = styled(Card)<StyledCardProps>(({ height, theme }) => {
  const isDark = isThemeDark(theme);

  return {
    ...createSecondaryAreaStyle(theme, {}),

    position: 'relative',
    height,

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
  };
});

const createLineStyle = ({
  canvas,
  color = 'rgb(0, 128, 255)',
}: {
  canvas: HTMLCanvasElement;
  color: string;
}) => ({
  backgroundColor: createGradientBackground({
    alpha: 0.4,
    height: 800,
    canvas,
    color,
  }),
  borderColor: color,
  pointBackgroundColor: color,
});

const createLineStyles = ({ canvas }: { canvas: HTMLCanvasElement }) => {
  return CHART_COLORS.map((color) => createLineStyle({ canvas, color }));
};

const createThresholdAnnotation = (
  value: number,
  label: string | undefined
) => ({
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

interface ChartOptionsWithAnnotation extends Chart.ChartOptions {
  annotation?: {};
}

const createOptions = ({
  formatPlaybackTimestamp,
  range,
  threshold,
  thresholdLabel,
  verticalUnit,
}: {
  formatPlaybackTimestamp?: (value: number) => string;
  range?: [number, number];
  threshold?: number | undefined | Array<number | undefined>;
  thresholdLabel?: string;
  verticalUnit?: string;
} = {}): ChartOptionsWithAnnotation => {
  const base = createChartStyle({
    animate: false,
    dark: true,
    rotateTickLabels: false,
    showPoints: false,
    smoothing: false,
  });

  // Ensure that we don't have exaggerated "spikes" on noisy velocity plots
  base.elements.line.borderJoinStyle = 'bevel';

  const timestampFormatter = formatPlaybackTimestamp
    ? (value: number) => formatPlaybackTimestamp(value)
    : String;

  let options: ChartOptionsWithAnnotation = {
    legend: {
      labels: {
        usePointStyle: true,
      },
    },

    layout: {
      padding: {
        top: 4,
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
            callback: timestampFormatter,
          },
        },
      ],
    },

    tooltips: {
      callbacks: {
        label(item: Chart.ChartTooltipItem, data: Chart.ChartData) {
          if (!data.datasets) {
            return '';
          }

          const datasetIndex = item.datasetIndex!;
          const index = item.index!;
          const value = item.value!;
          const originalDataPoint = data.datasets[datasetIndex].data![index];
          let label: string = data.datasets[datasetIndex].label ?? '';

          if (label) {
            label += ': ';
          }

          label += String(Math.round(Number(value) * 100) / 100);
          const originalTip: string = (originalDataPoint as any)?.tip;
          return originalTip
            ? `${label}${verticalUnit ?? ''} (${originalTip})`
            : `${label}${verticalUnit ?? ''}`;
        },

        title(item: Chart.ChartTooltipItem[]) {
          return item.length > 0
            ? timestampFormatter(item[0].xLabel as any as number)
            : '';
        },
      },
      intersect: false,
      mode: 'index',
    },
  };

  const thresholds: Array<number | undefined> =
    typeof threshold === 'number'
      ? [threshold]
      : Array.isArray(threshold)
        ? threshold
        : [];

  const annotations = thresholds
    .filter((x) => typeof x === 'number' && Number.isFinite)
    .map((threshold) => createThresholdAnnotation(threshold!, thresholdLabel));
  if (annotations.length > 0) {
    options.annotation = { annotations };
  }

  merge(base, options);
  options = base;

  options.scales!.xAxes![0].ticks!.callback = timestampFormatter;

  if (range && Array.isArray(range) && range.length >= 2) {
    options.scales!.yAxes![0].ticks!.suggestedMin = range[0];
    options.scales!.yAxes![0].ticks!.suggestedMax = range[1];
  }

  return options;
};

interface ChartPanelProps {
  readonly data: Array<{
    values: Array<{
      x: number;
      y: number | null;
      tip?: string | null;
    }>;
    label: string;
    role?: 'minimum' | 'maximum' | 'mean' | 'single';
  }>;
  readonly formatPlaybackTimestamp?: (value: number) => string;
  readonly height: number;
  readonly range: [number, number];
  readonly threshold?: number | undefined | Array<number | undefined>;
  readonly thresholdLabel?: string;
  readonly title?: string;
  readonly verticalUnit?: string;
}

const ChartPanel = ({
  data,
  formatPlaybackTimestamp,
  height,
  range,
  threshold,
  thresholdLabel,
  title,
  verticalUnit = '',
}: ChartPanelProps) => {
  const chartData = useMemo(
    () => (canvas: HTMLCanvasElement) => {
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
            fill: dataset.role === 'maximum' ? '+1' : false,
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
        formatPlaybackTimestamp,
        range,
        threshold,
        thresholdLabel,
        verticalUnit,
      }),
    [formatPlaybackTimestamp, range, threshold, thresholdLabel, verticalUnit]
  );

  return (
    <StyledCard square height={height}>
      <Scatter data={chartData as any} options={options} />
      {title && (
        <Box left={8} top={4} position='absolute'>
          <Typography variant='button'>{title}</Typography>
        </Box>
      )}
    </StyledCard>
  );
};

export default ChartPanel;
