/**
 * @file Theme setup for Material-UI.
 */

import { connect } from 'react-redux';

import { blue, lightBlue, red } from '@mui/material/colors';

import { createThemeProvider, ThemeType } from '@skybrush/app-theme-mui';
import type { ToastOptions } from 'react-hot-toast';

/**
 * Specialized Material-UI theme provider that is aware about the user's
 * preference about whether to use a dark or a light theme.
 */
const DarkModeAwareThemeProvider = createThemeProvider({
  primaryColor: (isDark: boolean) => (isDark ? red : blue),
  secondaryColor: (isDark: boolean) => (isDark ? lightBlue : red),
});

/**
 * Styling options for toast notifications.
 */
export const toastOptions: ToastOptions = {
  position: 'top-center',
  style: {
    background: '#333',
    color: '#fff',
  },
};

/**
 * Connects the theme provider to the Redux store.
 */
export default connect(
  // mapStateToProps
  () => ({
    type: ThemeType.DARK,
  })
)(DarkModeAwareThemeProvider);
