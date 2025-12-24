import { MiniList, MiniListItemButton } from '@skybrush/mui-components';
import { type Cue } from '@skybrush/show-format';

import { setPlaybackPosition } from '~/features/playback/actions';
import { useAppDispatch } from '~/hooks/store';
import { formatPlaybackTimestamp } from '~/utils/formatters';

import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';

const CueSheetSection = ({ cues }: { cues: readonly Cue[] }) => {
  const dispatch = useAppDispatch();

  return (
    <MiniList>
      {cues.map((cue, index) => (
        <MiniListItemButton
          key={index}
          onClick={() => {
            dispatch(setPlaybackPosition(cue.time));
          }}
          inset={2}
          primaryText={cue.name}
          secondaryText={formatPlaybackTimestamp(cue.time)}
        />
      ))}
    </MiniList>
  );
};

export default function CueListAccordion({
  cues,
  title,
}: {
  cues: readonly Cue[];
  title: string;
}) {
  if (cues.length === 0) {
    return null; // Don't render the accordion if there are no cues
  } else {
    return (
      <Accordion>
        <AccordionSummary>{title}</AccordionSummary>
        <AccordionDetails>
          <CueSheetSection cues={cues} />
        </AccordionDetails>
      </Accordion>
    );
  }
}
