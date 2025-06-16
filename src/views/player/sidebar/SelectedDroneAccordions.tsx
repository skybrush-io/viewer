import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import { useAppSelector } from '~/hooks/store';
import { getSelectedDroneIndices } from '~/features/selection/selectors';
import {
  getLightProgramPlayers,
  getNamesOfDronesInShow,
  getTrajectoryPlayers,
} from '~/features/show/selectors';
import { Accordion, AccordionSummary, AccordionDetails } from './Accordion';
import DroneInspectorSection from './DroneInspectorSection';

export default function SelectedDroneAccordions() {
  const { t } = useTranslation();
  const selection = useAppSelector(getSelectedDroneIndices);
  const names = useAppSelector(getNamesOfDronesInShow);
  const trajectoryPlayers = useAppSelector(getTrajectoryPlayers);
  const lightProgramPlayers = useAppSelector(getLightProgramPlayers);

  if (selection.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2, pr: 2, color: 'text.secondary' }}>
        {t('inspector.selectedDrones.hint')}
      </Box>
    );
  } else {
    return (
      <>
        {selection.map((index) => (
          <Accordion key={index} defaultExpanded>
            <AccordionSummary>
              {names[index] ??
                t('inspector.selectedDrones.unnamed', { index: index + 1 })}
            </AccordionSummary>
            <AccordionDetails>
              <DroneInspectorSection
                index={index}
                trajectoryPlayer={trajectoryPlayers[index]}
                lightProgramPlayer={lightProgramPlayers[index]}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </>
    );
  }
}
