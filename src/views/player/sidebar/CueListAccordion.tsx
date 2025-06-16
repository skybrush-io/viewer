import React from 'react';
import { useTranslation } from 'react-i18next';
import MiniList from '@skybrush/mui-components/lib/MiniList';
import MiniListItem from '@skybrush/mui-components/lib/MiniListItem';
import { type Cue } from '@skybrush/show-format';
import { getCues } from '~/features/show/selectors';
import { useAppSelector } from '~/hooks/store';
import { formatPlaybackTimestamp } from '~/utils/formatters';

import { Accordion, AccordionSummary, AccordionDetails } from './Accordion';

const CueListSection = ({ cues }: { cues: readonly Cue[] }) => (
  <MiniList>
    {cues.map((cue, index) => (
      <MiniListItem
        key={index}
        primaryText={cue.name}
        secondaryText={formatPlaybackTimestamp(cue.time)}
      />
    ))}
  </MiniList>
);

export default function CueListAccordion() {
  const cues = useAppSelector(getCues);
  const { t } = useTranslation();

  if (cues.length === 0) {
    return null; // Don't render the accordion if there are no cues
  } else {
    return (
      <Accordion>
        <AccordionSummary>{t('inspector.cueList.summary')}</AccordionSummary>
        <AccordionDetails>
          <CueListSection cues={cues} />
        </AccordionDetails>
      </Accordion>
    );
  }
}
