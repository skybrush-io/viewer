/**
 * @file Theme setup for Material-UI.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
  blue,
  lightBlue,
  grey,
  green,
  red,
  yellow,
} from '@material-ui/core/colors';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/core/styles';

import useDarkMode from '~/hooks/useDarkMode';

/**
 * Basic color definitions.
 */
export const Colors = {
  off: grey[700],
  error: '#f00', // possible alternative: red.A400
  info: lightBlue[500],
  success: green.A700,
  warning: yellow[700],

  dropTarget: 'rgba(3, 169, 244, 0.5)', // lightblue.500

  axisColors: {
    x: '#f44',
    y: '#4f4',
    z: '#06f',
  },

  landingMarker: '#3c3',
  originMarker: '#f44',
  takeoffMarker: '#fc0',
};

/**
 * Helper function that returns whether the given Material UI theme is a dark theme.
 */
export const isDark = (theme) => theme.palette.type === 'dark';

/**
 * Specialized Material-UI theme provider that is aware about the user's
 * preference about whether to use a dark or a light theme.
 */
const DarkModeAwareThemeProvider = ({ children, type }) => {
  const osHasDarkMode = useDarkMode();
  const isThemeDark = (type === 'auto' && osHasDarkMode) || type === 'dark';

  // Create the Material-UI theme that we are going to use
  const theme = createMuiTheme({
    palette: {
      type: isThemeDark ? 'dark' : 'light',
      primary: isThemeDark ? red : blue,
      secondary: isThemeDark ? lightBlue : red,

      success: {
        main: Colors.success,
      },
    },

    typography: {
      fontFamily: '"Fira Sans", "Helvetica", "Arial", sans-serif',
    },

    overrides: {
      MuiList: {
        root: {
          background: isThemeDark ? '#444' : '#fff',
        },
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

DarkModeAwareThemeProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  type: PropTypes.oneOf(['auto', 'dark', 'light']),
};

export default connect(
  // mapStateToProps
  () => ({
    type: 'dark',
  })
)(DarkModeAwareThemeProvider);
