import React from 'react';
import ChevronRight from '@mui/icons-material/ChevronRight';
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  type AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails, {
  type AccordionDetailsProps,
} from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))({
  backgroundColor: 'transparent',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
});

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ChevronRight />} {...props} />
))(({ theme }) => ({
  backgroundColor: 'transparent',
  flexDirection: 'row-reverse',
  fontSize: theme.typography.body1.fontSize,
  minHeight: theme.spacing(4),
  margin: theme.spacing(0, 0, 0, -2.5),
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(90deg)',
    },
  [`& .${accordionSummaryClasses.content}`]: {
    margin: 0,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const AccordionDetails = styled((props: AccordionDetailsProps) => (
  <MuiAccordionDetails {...props} />
))(({ theme }) => ({
  padding: theme.spacing(0, 0, 2, 0),
}));

export { Accordion, AccordionSummary, AccordionDetails };
