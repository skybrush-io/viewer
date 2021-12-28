import * as React from 'react';

import logo from '~/../assets/img/logo.png';

interface SkybrushLogoProps extends React.ComponentPropsWithoutRef<'img'> {
  width?: number;
}

const SkybrushLogo = ({ width = 160, ...rest }: SkybrushLogoProps) => (
  <img src={logo} alt='Skybrush Viewer' width={width} {...rest} />
);

export default SkybrushLogo;
