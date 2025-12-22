import http from 'node:http';
import process from 'node:process';

import express from 'express';
import { Server as SSDPServer } from 'node-ssdp';

import apiV1 from './api-v1.mjs';

/**
 * @param {number} port  the port on which our own HTTP server will be listening
 */
const setupSSDPDiscovery = async (port) => {
  const UPNP_DEVICE_ID = `urn:collmot-com:device:skybrush-viewer:1`;
  const UPNP_SERVICE_ID = `urn:collmot-com:service:skyc-validator:1`;

  const location = `http://localhost:${port}`;
  const server = new SSDPServer({ location });

  server.addUSN(UPNP_DEVICE_ID);
  server.addUSN(UPNP_SERVICE_ID);

  try {
    await server.start();
    process.on('exit', () => server.stop());
  } catch (err) {
    console.warn('No SSDP sockets were created; SSDP discovery is disabled.');
    console.error(err);
  }
};

export const setupHttpServer = async ({ port = 0 } = {}) => {
  const app = express();
  const server = http.createServer(app).listen({ port });

  port = server.address().port;
  await setupSSDPDiscovery(port);

  app.set('port', port);

  app.use(
    express.raw({ type: 'application/skybrush-compiled', limit: '128mb' })
  );

  app.use('/api/v1', apiV1);

  /* eslint-disable @typescript-eslint/no-unsafe-call */
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  app.use((error, _req, res, next) => {
    console.log(error);

    if (res.headersSent) {
      return next(error);
    }

    res.status(500);
    res.json({ error: String(error) || 'Unexpected error' });
  });
  /* eslint-enable @typescript-eslint/no-unsafe-return */
  /* eslint-enable @typescript-eslint/no-unsafe-call */

  console.log(`Skybrush Viewer HTTP server listening on port ${port}`);
};

export default setupHttpServer;
