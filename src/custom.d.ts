// Make PNG imports work nicely with Typescript
declare module '*.png' {
  const value: string;
  export default value;
}

// Provide typings for @skybrush/app-theme-mui
declare module '@skybrush/app-theme-mui' {
  import type { Theme } from '@mui/material/styles';

  export function isThemeDark(theme: Theme): boolean;
}
