import Color from 'color';
import React, { useMemo } from 'react';

import Box, { type BoxProps } from '@mui/material/Box';

require('~/../assets/css/dseg.css');

type LCDTextVariant = 'default' | '7segment' | '14segment';

const variants: Record<
  LCDTextVariant,
  { allSegmentsChar?: string; sx?: BoxProps['sx'] }
> = {
  default: {},

  '7segment': {
    allSegmentsChar: '8',
    sx: {
      fontFamily: 'DSEG7-Classic',
      position: 'relative',
      display: 'inline-block',
    },
  },

  '14segment': {
    allSegmentsChar: '~',
    sx: {
      fontFamily: 'DSEG14-Classic',
      position: 'relative',
      display: 'inline-block',
    },
  },
};

const offSegmentStyleBase: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  opacity: 0.2,
};

type LCDTextProps = {
  children: string;
  color?: string;
  decoration?: 'plain' | 'glow' | 'shadow';
  height: number;
  off?: boolean;
  offSegments?: boolean;
  variant?: LCDTextVariant;
} & BoxProps;

/**
 * Component that shows some test using 14-segment LCD characters.
 */
export default function LCDText({
  children,
  color,
  decoration = 'plain',
  height,
  off,
  offSegments,
  variant = 'default',
  ...rest
}: LCDTextProps) {
  const textStyle = useMemo(() => {
    const fontSize =
      height === undefined ? undefined : Math.floor(height * 0.7);
    const result: React.CSSProperties = { fontSize, height };

    if (color !== undefined) {
      result.color = color;
    }

    if (off) {
      result.opacity = 0.3;
    }

    if (!off) {
      switch (decoration) {
        case 'glow': {
          const glowSize = fontSize === undefined ? 4 : Math.round(fontSize);
          result.textShadow = `0 0 ${glowSize}px ${color || 'currentColor'}`;
          break;
        }

        case 'shadow': {
          const shadowOffset = fontSize === undefined || fontSize <= 16 ? 1 : 2;
          const shadowColor = new Color(color || 'black').alpha(0.3).string();
          result.textShadow = `${shadowOffset}px ${shadowOffset}px 0 ${shadowColor}`;
          break;
        }

        default:
          break;
      }
    }

    result.transition = 'color 150ms';

    return result;
  }, [color, decoration, height, off]);

  const offSegmentStyle = useMemo(() => {
    const fontSize = Math.floor(height * 0.7);
    return {
      ...offSegmentStyleBase,
      color: color ?? 'black',
      fontSize,
      height,
    } as React.CSSProperties;
  }, [color, height]);

  variant = variant ?? 'default';

  return (
    <Box sx={variants[variant].sx} {...rest}>
      {offSegments && variant !== 'default' && (
        <div style={offSegmentStyle}>
          {children.replace(/[^:. ]/g, variants[variant].allSegmentsChar ?? '')}
        </div>
      )}
      <div style={textStyle}>{children}</div>
    </Box>
  );
}
