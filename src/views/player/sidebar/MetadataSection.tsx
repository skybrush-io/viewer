import Alarm from '@mui/icons-material/Alarm';
import Explore from '@mui/icons-material/Explore';
import Flare from '@mui/icons-material/Flare';
import Landscape from '@mui/icons-material/Landscape';
import Tag from '@mui/icons-material/Tag';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Box from '@mui/material/Box';
import MiniList from '@skybrush/mui-components/lib/MiniList';
import MiniListItem from '@skybrush/mui-components/lib/MiniListItem';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { hasAudio } from '~/features/audio/selectors';
import {
  getNumberOfDronesInShow,
  getShowDurationAsString,
  getShowEnvironmentType,
  getShowTitle,
  hasPyroControl,
  hasYawControl,
} from '~/features/show/selectors';
import { useAppSelector } from '~/hooks/store';

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

  return (
    <>
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
          secondaryText={droneCount}
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
          secondaryText={formatYesOrNo(isPyroControlled, t)}
          icon={<Flare fontSize='small' sx={ICON_STYLE} />}
        />
      </MiniList>
    </>
  );
}
