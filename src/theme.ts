/**
 * @file Theme setup for Material-UI.
 */

import { connect } from 'react-redux';

import { blue, lightBlue, red } from '@mui/material/colors';

import { createThemeProvider } from '@skybrush/app-theme-mui';

/**
 * Specialized Material-UI theme provider that is aware about the user's
 * preference about whether to use a dark or a light theme.
 */
const DarkModeAwareThemeProvider = createThemeProvider({
  primaryColor: (isDark: boolean) => (isDark ? red : blue),
  secondaryColor: (isDark: boolean) => (isDark ? lightBlue : red),
});

export default connect(
  // mapStateToProps
  () => ({
    type: 'dark',
  })
)(DarkModeAwareThemeProvider);
