/**
 * @file Module that contains everything that is needed for Skybrush Viewer only
 * when it is being run as a desktop application.
 */

import config from 'config';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

class SkybrushViewer {
  /**
   * Convenience method for the most common use-case of this class: find the
   * #root div on the page and inject Skybrush Viewer into it.
   */
  static run() {
    new SkybrushViewer().render('#root');
  }

  render(selector: string): () => void {
    const element = document.querySelector(selector);
    const root = createRoot(element!);
    root.render(<App />);
    return root.unmount;
  }
}

if (config.startAutomatically) {
  // Start the app automatically but do not export it to the page
  SkybrushViewer.run();
} else {
  // Export the SkybrushViewer class to the global context
  (window as any).SkybrushViewer = SkybrushViewer;
}
