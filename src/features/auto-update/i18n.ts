export type TFunction = (key: string) => string;

export type I18NKey =
  | 'check'
  | 'download'
  | 'install'
  | 'checkInProgress'
  | 'downloadInProgress'
  | 'installInProgress'
  | 'checkFailed'
  | 'downloadFailed'
  | 'installFailed';

const DEFAULT_I18N: Record<I18NKey, string> = {
  check: 'Check for updates',
  download: 'Download update',
  install: 'Install update',
  checkFailed: 'Update check failed',
  downloadFailed: 'Download failed',
  installFailed: 'Installation failed',
  checkInProgress: 'Checking for updates',
  downloadInProgress: 'Downloading update',
  installInProgress: 'Installing update',
};

export function defaultTranslation(key: string): string {
  return DEFAULT_I18N[key as I18NKey] ?? key;
}
