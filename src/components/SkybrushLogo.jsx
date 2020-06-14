import React from 'react';

const logo = require('~/../assets/img/logo.png').default;

const SkybrushLogo = (props) => (
  <img src={logo} alt='Skybrush Viewer' {...props} />
);

SkybrushLogo.defaultProps = {
  width: 160,
};

export default SkybrushLogo;
