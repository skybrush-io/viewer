import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { getSelectedDroneIndices } from '~/features/selection/selectors';
import {
  getLightProgramPlayers,
  getNamesOfDronesInShow,
  getTrajectoryPlayers,
} from '~/features/show/selectors';
import { useAppSelector } from '~/hooks/store';
import { formatDroneIndex } from '~/utils/formatters';
import { isRunningOnMac } from '~/utils/platform';
import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';
import DroneInspectorSection from './DroneInspectorSection';

export default function SelectedDroneAccordions() {
  const { t } = useTranslation();
  const selection = useAppSelector(getSelectedDroneIndices);
  const names = useAppSelector(getNamesOfDronesInShow);
  const trajectoryPlayers = useAppSelector(getTrajectoryPlayers);
  const lightProgramPlayers = useAppSelector(getLightProgramPlayers);

  // t('inspector.selectedDrones.hintMultiple.mac')
  // t('inspector.selectedDrones.hintMultiple.other')

  if (selection.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2, pr: 2, color: 'text.secondary' }}>
        {t('inspector.selectedDrones.hint') +
          ' ' +
          t(
            `inspector.selectedDrones.hintMultiple.${isRunningOnMac ? 'mac' : 'other'}`
          )}
      </Box>
    );
  } else {
    return (
      <>
        {selection.map((index) => (
          <Accordion key={index} defaultExpanded>
            <AccordionSummary>
              {names[index] ??
                t('inspector.selectedDrones.unnamed', {
                  index: formatDroneIndex(index),
                })}
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
