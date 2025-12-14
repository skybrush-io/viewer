import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';
import CueSheetAccordion from './CueSheetAccordion';
import MetadataSection from './MetadataSection';
import PlayheadSection from './PlayheadSection';
import SelectedDroneAccordions from './SelectedDroneAccordions';

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

      <CueSheetAccordion />
      <SelectedDroneAccordions />
    </Box>
  );
};

export default InspectorTab;
