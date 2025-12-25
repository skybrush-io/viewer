import { useTranslation } from 'react-i18next';

import { MAX_PYRO_CUE_NAME_LENGTH } from '~/constants';
import { getPyroCues } from '~/features/show/selectors';
import { useAppSelector } from '~/hooks/store';
import { truncate } from '~/utils/formatters';

import CueListAccordion from './CueListAccordion';

export default function PyroCuesAccordion() {
  const cues = useAppSelector(getPyroCues);
  const { t } = useTranslation();

  if (cues.length === 0) {
    return null;
  }

  return (
    <CueListAccordion
      cues={cues.map((cue, index) => {
        const droneCount = cue.droneIndices.size;
        // Use channel + 1 as channel number if available, otherwise fall back to index + 1
        const channel = cue.channel !== undefined ? cue.channel + 1 : index + 1;
        const payloadNames = cue.payloadNames || [];

        // Build primary text with payload name right after channel.
        // Truncate long payload names to fit better.
        const payloadName = truncate(
          payloadNames.join(', '),
          MAX_PYRO_CUE_NAME_LENGTH
        );

        const primaryText = payloadName
          ? t('inspector.pyroCues.itemWithNumber', {
              channel,
              payloadName,
              count: droneCount,
            })
          : t('inspector.pyroCues.itemWithNumberNoPayload', {
              channel,
              count: droneCount,
            });

        return {
          name: primaryText,
          time: cue.time,
        };
      })}
      title={t('inspector.pyroCues.summary')}
    />
  );
}
