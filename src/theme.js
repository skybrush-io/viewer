/**
 * @file Theme setup for Material-UI.
 */

import { connect } from 'react-redux';

import { createThemeProvider } from '@skybrush/app-theme-material-ui';

import { blue, lightBlue, red } from '@material-ui/core/colors';

/**
 * Helper function that returns whether the given Material UI theme is a dark theme.
 */
export const isDark = (theme) => theme.palette.type === 'dark';

/**
 * Specialized Material-UI theme provider that is aware about the user's
 * preference about whether to use a dark or a light theme.
 */
const DarkModeAwareThemeProvider = createThemeProvider({
  primaryColor: (isDark) => (isDark ? red : blue),
  secondaryColor: (isDark) => (isDark ? lightBlue : red),
});

export default connect(
  // mapStateToProps
  () => ({
    type: 'dark',
  })
)(DarkModeAwareThemeProvider);
