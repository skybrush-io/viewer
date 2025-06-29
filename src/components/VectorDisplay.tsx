import clsx from 'clsx';
import React, { Fragment } from 'react';
import { styled } from '@mui/material';

type Vector3DProps = Readonly<{
  value: number[];
  colored?: boolean;
  digits?: number;
  labels?: string[];
  minUnitWidth?: number;
  minValueWidth?: number;
  unit?: string;
  warnings?: number[];
}>;

type StyledBoxProps = Pick<Vector3DProps, 'minValueWidth' | 'minUnitWidth'>;

const StyledBox = styled('div')<StyledBoxProps>(
  ({ minUnitWidth, minValueWidth, theme }) => ({
    display: 'flex',
    width: '100%',
    fontSize: theme.typography.body2.fontSize,

    '& > div': {
      padding: theme.spacing(0, 0.5),
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },

    '& .Vector3D-label': {
      textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)',
    },

    '& .Vector3D-red': {
      backgroundColor: '#cc0000',
      color: '#ffffff',
    },

    '& .Vector3D-green': {
      backgroundColor: '#00cc00',
      color: '#000000',
    },

    '& .Vector3D-blue': {
      backgroundColor: '#0000cc',
      color: '#ffffff',
    },

    '& .Vector3D-gray': {
      backgroundColor: '#666666',
      color: '#ffffff',
    },

    '& .Vector3D-warning': {
      backgroundColor: '#ff8800',
      color: '#ffffff',
      textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)',
    },

    '& .Vector3D-value': {
      flex: 1,
      textAlign: 'right',
      padding: theme.spacing(0, 1, 0, 0),
      fontVariantNumeric: 'tabular-nums',
      minWidth: minValueWidth ?? 50,
    },

    '& .Vector3D-unit': {
      color: theme.palette.text.secondary,
      minWidth: minUnitWidth ?? 45,
      textAlign: 'right',
    },
  })
);

const DEFAULT_LABELS = ['X', 'Y', 'Z'] as [string, string, string];
const COLOR_CLASSES = [
  'Vector3D-red',
  'Vector3D-green',
  'Vector3D-blue',
] as const;

const EMPTY_ARRAY: number[] = [] as const;

export default function VectorDisplay({
  value,
  colored = false,
  digits = 2,
  labels = DEFAULT_LABELS,
  minValueWidth,
  minUnitWidth,
  unit = '',
  warnings = EMPTY_ARRAY,
}: Vector3DProps) {
  return (
    <StyledBox minValueWidth={minValueWidth} minUnitWidth={minUnitWidth}>
      {value.map((v, i) => (
        <Fragment key={i}>
          <div
            className={clsx(
              'Vector3D-label',
              colored ? COLOR_CLASSES[i] : 'Vector3D-gray'
            )}
          >
            {labels[i]}
          </div>
          <div
            className={clsx(
              'Vector3D-value',
              warnings.includes(i) && 'Vector3D-warning'
            )}
          >
            {v.toFixed(digits)}
          </div>
        </Fragment>
      ))}
      {unit && <div className='Vector3D-unit'>{unit}</div>}
    </StyledBox>
  );
}
