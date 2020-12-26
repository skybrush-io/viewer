import React from 'react';

import logo from '~/../assets/img/logo.png';

const SkybrushLogo = (props) => (
  <img src={logo} alt='Skybrush Viewer' {...props} />
);

SkybrushLogo.defaultProps = {
  width: 160,
};

export default SkybrushLogo;
