import { MiniList, MiniListItemButton } from '@skybrush/mui-components';
import { type Cue } from '@skybrush/show-format';
import { useTranslation } from 'react-i18next';
import { getCues } from '~/features/show/selectors';
import { useAppDispatch, useAppSelector } from '~/hooks/store';
import { formatPlaybackTimestamp } from '~/utils/formatters';

import { setPlaybackPosition } from '~/features/playback/actions';
import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';

const CueSheetSection = ({ cues }: { cues: readonly Cue[] }) => {
  const dispatch = useAppDispatch();

  return (
    <MiniList>
      {cues.map((cue, index) => (
        <MiniListItemButton
          onClick={() => {
            dispatch(setPlaybackPosition(cue.time));
          }}
          key={index}
          primaryText={cue.name}
          secondaryText={formatPlaybackTimestamp(cue.time)}
        />
      ))}
    </MiniList>
  );
};

export default function CueListAccordion() {
  const cues = useAppSelector(getCues);
  const { t } = useTranslation();

  if (cues.length === 0) {
    return null; // Don't render the accordion if there are no cues
  } else {
    return (
      <Accordion>
        <AccordionSummary>{t('inspector.cueSheet.summary')}</AccordionSummary>
        <AccordionDetails>
          <CueSheetSection cues={cues} />
        </AccordionDetails>
      </Accordion>
    );
  }
}
