import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { getLanguage } from '~/features/settings/selectors';
import { useAppSelector } from '~/hooks/store';

/**
 * Component that updates the language of the application whenever the
 * respective setting changes in the state.
 */
const LanguageWatcher = () => {
  const { i18n } = useTranslation();
  const language = useAppSelector(getLanguage);

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [i18n, language]);

  return null;
};

export default LanguageWatcher;
