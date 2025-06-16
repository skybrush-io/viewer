import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';

import { Accordion, AccordionSummary, AccordionDetails } from './Accordion';
import CueListAccordion from './CueListAccordion';
import MetadataSection from './MetadataSection';
import SelectedDroneAccordions from './SelectedDroneAccordions';
import PlayheadSection from './PlayheadSection';

/**
 * The inspector tab of the player sidebar.
 */
const InspectorTab = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ px: 2 }}>
      <PlayheadSection />

      <Accordion defaultExpanded>
        <AccordionSummary>{t('inspector.metadata.summary')}</AccordionSummary>
        <AccordionDetails>
          <MetadataSection />
        </AccordionDetails>
      </Accordion>

      <CueListAccordion />
      <SelectedDroneAccordions />
    </Box>
  );
};

export default InspectorTab;
