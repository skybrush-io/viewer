import { useTranslation } from 'react-i18next';

import { getCues } from '~/features/show/selectors';
import { useAppSelector } from '~/hooks/store';

import CueListAccordion from './CueListAccordion';

export default function CueSheetAccordion() {
  const cues = useAppSelector(getCues);
  const { t } = useTranslation();

  return (
    <CueListAccordion cues={cues} title={t('inspector.cueSheet.summary')} />
  );
}
