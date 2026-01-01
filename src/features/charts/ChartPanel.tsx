import { isNil, merge } from 'lodash-es';
import { memo, useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';

import Box from '@mui/material/Box';
import Card, { type CardProps } from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { orange } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

import CentralHelperPanel from '~/components/CentralHelperPanel';

import {
  createChartStyle,
  createGradientBackground,
  createSecondaryAreaStyle,
  isThemeDark,
} from '@skybrush/app-theme-mui';

import { CHART_COLORS } from './constants';
import type { Chart, ChartCalculationState } from './types';

import 'chartjs-plugin-annotation';
import 'chartjs-plugin-crosshair';
import { useTranslation } from 'react-i18next';

type StyledCardProps = CardProps & {
  height: number;
};

const StyledCard = styled((props: StyledCardProps) => <Card {...props} />)(({
  height,
  theme,
}) => {
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

type ChartOptionsWithAnnotation = Chart.ChartOptions & {
  annotation?: object;
};

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

export type ChartPanelProps = {
  /**
   * The chart data being shown in the panel. Ignored if `calculation` is also
   * specified. Use this for chart data that has already been calculated.
   */
  chart?: Chart;

  /**
   * The calculation that will eventually provide the chart data being shown in the
   * panel. Takes precedence over `chart`. Use this for asynchronous chart calculations
   * that take a longer time.
   */
  calculation?: ChartCalculationState;

  /** Formatter for timestamps on the X axis of the chart */
  formatPlaybackTimestamp?: (value: number) => string;

  /** Height of the chart panel in pixels */
  height: number;

  /** Y axis range for the chart */
  range: [number, number];

  /** Threshold value(s) to show on the chart as annotations */
  threshold?: number | undefined | Array<number | undefined>;

  /** Label for the threshold annotation */
  thresholdLabel?: string;

  /** Title of the chart */
  title?: string;

  /** Unit string to show on the vertical axis and in tooltips */
  verticalUnit?: string;
};

// Add memoization to the Scatter component to avoid re-rendering it when the
// chart is generated asynchronously and we are only updating the progress state.
//
// This memoization is also required to avoid a weird exception that happens when
// toggling any of the _other_ plots while the proximity plot (an async plot)
// is visible.
const MemoScatter = memo(Scatter);

const ChartPanel = ({
  calculation,
  chart,
  formatPlaybackTimestamp,
  height,
  range,
  threshold,
  thresholdLabel,
  title,
  verticalUnit = '',
}: ChartPanelProps) => {
  const { t } = useTranslation();
  const { status, error, progress } = calculation ?? { status: 'idle' };
  const calculating = status === 'calculating';

  const { datasets } = (calculation ? calculation.data : chart) ?? {};
  const rawScatterData = useMemo(
    () => (canvas: HTMLElement) => {
      if (!(canvas instanceof HTMLCanvasElement)) {
        // We support drawing on canvas elements only
        return { datasets: [] };
      }

      const lineStyles = createLineStyles({ canvas });
      const numberStyles = lineStyles.length;

      const series = [];
      const index = 0;
      let styleIndex = 0;

      for (const dataset of datasets ?? []) {
        if (dataset) {
          const isBoundary =
            dataset.role === 'minimum' || dataset.role === 'maximum';

          series.push({
            label: dataset.label ?? `Series ${index + 1}`,
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

      if (series.length === 0) {
        // Create a dummy series to make place for the legend at the top
        series.push({ label: '' });
      }

      return {
        datasets: series,
      };
    },
    [datasets]
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

  const showHeaderBox = !isNil(title) || !isNil(error) || calculating;

  return (
    <StyledCard square height={height}>
      <MemoScatter data={rawScatterData} options={options} />
      {showHeaderBox ? (
        <Box left={8} top={4} right={8} position='absolute' display='flex'>
          {isNil(title) ? null : (
            <Box>
              <Typography variant='button'>{title}</Typography>
            </Box>
          )}
          <Box flex={1} />
          {calculating || isNil(error) ? null : (
            <Box>
              <Typography variant='button' color='error'>
                {error}
              </Typography>
            </Box>
          )}
        </Box>
      ) : null}
      <CentralHelperPanel padding={2} visible={calculating}>
        <Typography variant='body1'>{t('generic.pleaseWait')}</Typography>
        {/* the key below is necessary to _prevent_ the progress bar from trying to
         * animate its bar from an indeterminate state to a determinate state. We
         * prefer to remove the indeterminate progress bar completely and replace it
         * with a fresh determinate progress bar */}
        <LinearProgress
          key={isNil(progress) ? 'indeterminate' : 'determinate'}
          value={progress}
          variant={isNil(progress) ? 'indeterminate' : 'determinate'}
          sx={{ my: 1, width: 320 }}
        />
      </CentralHelperPanel>
    </StyledCard>
  );
};

export default ChartPanel;
