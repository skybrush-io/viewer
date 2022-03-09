import React from 'react';

import Chip, { ChipProps } from '@mui/material/Chip';

const style = {
  borderStyle: 'solid',
  borderWidth: '1px',
  cursor: 'pointer',
} as const;

interface PanelToggleChipProps extends ChipProps {
  selected: boolean;
}

const PanelToggleChip = ({ selected, ...rest }: PanelToggleChipProps) => (
  <Chip
    clickable
    color={selected ? 'primary' : 'default'}
    variant={selected ? 'filled' : 'outlined'}
    sx={style}
    {...rest}
  />
);

export default PanelToggleChip;
