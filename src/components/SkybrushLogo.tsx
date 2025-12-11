import React from 'react';

import logo from '~/../assets/img/logo.png';

type SkybrushLogoProps = React.ComponentPropsWithoutRef<'img'> & {
  readonly width?: number;
};

const SkybrushLogo = ({ width = 160, ...rest }: SkybrushLogoProps) => (
  <img src={logo} alt='Skybrush Viewer' width={width} {...rest} />
);

export default SkybrushLogo;
