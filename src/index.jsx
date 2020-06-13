/**
 * @file Module that contains everything that is needed for Skybrush Viewer only
 * when it is being run as a desktop application.
 */

import React from 'react';
import { render } from 'react-dom';

import App from './app';
import rootSaga from './sagas';
import { sagaMiddleware, waitUntilStateRestored } from './store';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

// Spin up the root saga after the state has been restored.
waitUntilStateRestored().then(() => {
  sagaMiddleware.run(rootSaga);
});

// Render the application
const root = document.querySelector('#root');
render(<App />, root);
