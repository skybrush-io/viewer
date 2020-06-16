import PropTypes from 'prop-types';
import React from 'react';
import { CoverPagePresentation as CoverPage } from 'react-cover-page';

const logo = require('~/../assets/icons/splash.png').default;

const SplashScreen = ({ visible }) => (
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

SplashScreen.propTypes = {
  visible: PropTypes.bool,
};

SplashScreen.defaultProps = {
  visible: true,
};

export default SplashScreen;
