/**
 * @file Module that contains everything that is needed for Skybrush Viewer only
 * when it is being run as a desktop application.
 */

import config from 'config';

import { SkybrushViewer } from './startup';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

if (config.startAutomatically) {
  // Start the app automatically but do not export it to the page
  SkybrushViewer.run();
} else {
  // Export the SkybrushViewer class to the global context
  (window as any).SkybrushViewer = SkybrushViewer;
}
