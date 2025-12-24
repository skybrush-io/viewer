import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import Alarm from '@mui/icons-material/Alarm';
import Explore from '@mui/icons-material/Explore';
import Flare from '@mui/icons-material/Flare';
import Landscape from '@mui/icons-material/Landscape';
import Tag from '@mui/icons-material/Tag';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Box from '@mui/material/Box';

import { MiniList, MiniListItem } from '@skybrush/mui-components';

import { hasAudio } from '~/features/audio/selectors';
import {
  getNumberOfDronesInShow,
  getPyroCues,
  getShowDurationAsString,
  getShowEnvironmentType,
  getShowTitle,
  hasPyroControl,
  hasYawControl,
} from '~/features/show/selectors';
import { useAppSelector } from '~/hooks/store';

import { CueListAccordion } from './CueSheetAccordion';

// t('inspector.metadata.environment.indoor')
// t('inspector.metadata.environment.outdoor')

export const ICON_STYLE = { mr: 1 };

const formatYesOrNo = (value: boolean, t: TFunction) =>
  value
    ? t('generic.yes').toLocaleLowerCase()
    : t('generic.no').toLocaleLowerCase();

export default function MetadataSection() {
  const { t } = useTranslation();
  const title = useAppSelector(getShowTitle);
  const duration = useAppSelector(getShowDurationAsString);
  const droneCount = useAppSelector(getNumberOfDronesInShow);
  const environment = useAppSelector(getShowEnvironmentType);
  const hasAudioTrack = useAppSelector(hasAudio);
  const isYawControlled = useAppSelector(hasYawControl);
  const isPyroControlled = useAppSelector(hasPyroControl);
  const pyroCues = useAppSelector(getPyroCues);

  return (
    <Box sx={{ px: 2 }}>
      <Box
        sx={{
          fontWeight: 'bold',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          py: 0.5,
        }}
      >
        {title}
      </Box>
      <MiniList>
        <MiniListItem
          primaryText={t('inspector.metadata.duration')}
          secondaryText={duration}
          icon={<Alarm fontSize='small' sx={ICON_STYLE} />}
        />
        <MiniListItem
          primaryText={t('inspector.metadata.droneCount')}
          secondaryText={String(droneCount)}
          icon={<Tag fontSize='small' sx={ICON_STYLE} />}
        />
        <MiniListItem
          primaryText={t('inspector.metadata.environment.label')}
          secondaryText={t(`inspector.metadata.environment.${environment}`)}
          icon={<Landscape fontSize='small' sx={ICON_STYLE} />}
        />
        <MiniListItem
          primaryText={t('inspector.metadata.audio')}
          secondaryText={formatYesOrNo(hasAudioTrack, t)}
          icon={<VolumeUp fontSize='small' sx={ICON_STYLE} />}
        />
        <MiniListItem
          primaryText={t('inspector.metadata.yawControl')}
          secondaryText={formatYesOrNo(isYawControlled, t)}
          icon={<Explore fontSize='small' sx={ICON_STYLE} />}
        />
        <MiniListItem
          primaryText={t('inspector.metadata.pyroControl')}
          secondaryText={[
            formatYesOrNo(isPyroControlled, t),
            ...(pyroCues.length > 0
              ? [
                  t('inspector.metadata.pyroCuesCount', {
                    count: pyroCues.length,
                  }),
                ]
              : []),
          ].join(', ')}
          icon={<Flare fontSize='small' sx={ICON_STYLE} />}
        />
      </MiniList>
      {pyroCues.length > 0 && (
        <CueListAccordion
          cues={pyroCues.map((cue, index) => {
            const droneCount = cue.droneIndices.length;
            // Use channel + 1 as channel number if available, otherwise fall back to index + 1
            const channel =
              cue.channel !== undefined ? cue.channel + 1 : index + 1;
            const payloadNames = cue.payloadNames || [];

            // Build primary text with payload name right after channel
            const payloadText = payloadNames.join(', ');
            // Truncate long payload names to fit better
            const truncatedPayload =
              payloadText.length > 25
                ? payloadText.substring(0, 24) + '…'
                : payloadText;

            const primaryText = truncatedPayload
              ? t('inspector.metadata.pyroCueItemWithNumber', {
                  channel,
                  payloadName: truncatedPayload,
                  count: droneCount,
                })
              : t('inspector.metadata.pyroCueItemWithNumberNoPayload', {
                  channel,
                  count: droneCount,
                });

            return {
              name: primaryText,
              time: cue.time,
            };
          })}
          title={t('inspector.metadata.pyroCuesList')}
        />
      )}
    </Box>
  );
}
