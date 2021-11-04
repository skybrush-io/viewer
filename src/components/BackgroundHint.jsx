/**
 * @file Component that gives a hint to the user about the usage of the
 * application.
 */

import PropTypes from 'prop-types';
import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
  color: 'text.secondary',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  height: '100%',
  userSelect: 'none',
};

/**
 * Component that gives a hint to the user about the usage of the
 * application.
 *
 * The hint is presented as text in large print placed in the middle of
 * the area dedicated to the component.
 *
 * @return {Object} the rendered component
 */
const BackgroundHint = ({ button, header, icon, iconColor, text, ...rest }) => {
  const iconStyle = icon
    ? {
        fontSize: 48,
      }
    : undefined;

  if (iconStyle && iconColor) {
    iconStyle.color = iconColor;
  }

  return (
    <Box sx={style} {...rest}>
      <div>
        {icon && (
          <Box pb={2}>{React.cloneElement(icon, { style: iconStyle })}</Box>
        )}
        {header && (
          <Typography paragraph variant='h6'>
            {header}
          </Typography>
        )}
        <div>{text}</div>
        {button && <Box pt={2}>{button}</Box>}
      </div>
    </Box>
  );
};

BackgroundHint.propTypes = {
  button: PropTypes.node,
  header: PropTypes.string,
  icon: PropTypes.node,
  iconColor: PropTypes.string,
  text: PropTypes.string,
};

export default BackgroundHint;
