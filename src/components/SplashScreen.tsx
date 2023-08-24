import React from 'react';
import { CoverPagePresentation as CoverPage } from 'react-cover-page';

import logo from '~/../assets/icons/splash.png';

interface SplashScreenProps {
  readonly visible: boolean;
}

const SplashScreen = ({ visible = true }: SplashScreenProps) => (
  <CoverPage
    loading
    visible={visible}
    icon={<img src={logo} width={96} height={96} alt='' />}
    title={
      <span>
        skybrush <b style={{ fontWeight: 400 }}>viewer</b>
      </span>
    }
  />
);

export default SplashScreen;
