import { createSocket } from 'node:dgram';
import http from 'node:http';
import { networkInterfaces } from 'node:os';
import process from 'node:process';

import express from 'express';
import { Server as SSDPServer } from 'node-ssdp';

import apiV1 from './api-v1.mjs';

function isOwnIPAddress(address) {
  const nets = networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.address === address) {
        return true;
      }
    }
  }

  return false;
}

// Monkey-patch SSDPServer._send so we never send advertisements and we respond
// to requests from our own IP only

/**
 * @typedef {(message: unknown, host: string, port: number, cb: (error?: any) => void) => void} SSDPServerSendFn
 */

/** @type {SSDPServerSendFn} */
const _originalSend = SSDPServer.prototype._send;

/**
 * @param {unknown} message
 * @param {string} host
 * @param {number} port
 * @param {(error?: any) => void} cb
 */
SSDPServer.prototype._send = function (message, host, port, cb) {
  if (typeof host === 'function') {
    // This is an advertisement
    cb = host;
    cb();
  } else if (host === '127.0.0.1' || isOwnIPAddress(host)) {
    // Check whether the host IP address is ours; we don't respond to requests
    // coming from another machine
    _originalSend.call(this, message, host, port, cb);
  } else {
    cb();
  }
};

// Monkeypatch SSDPServer so we create sockets for local and non-local interfaces
// alike. This is because we need a socket on localhost even if no other
// interface is available. However, we also need non-local interfaces because
// older versions of the Skybrush Studio for Blender add-on look for Skybrush
// Viewer in the "real" IP addresses of the network interfaces only, not on
// 127.0.0.1. This was fixed in versions 1.9.2 and 1.10.0 of the Blender add-on.
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
SSDPServer.prototype._createSockets = function () {
  const interfaces = networkInterfaces();

  for (const iName of Object.keys(interfaces)) {
    if (this._interfaces && this._interfaces.includes(iName)) {
      continue;
    }

    this._logger('discovering all IPs from interface %s', iName);

    for (const ipInfo of interfaces[iName]) {
      if (ipInfo.family === 'IPv4') {
        const socket = createSocket({
          type: 'udp4',
          reuseAddr: this._reuseAddr,
        });
        if (socket) {
          socket.unref();
          this.sockets[ipInfo.address] = socket;
        }
      }
    }
  }

  if (Object.keys(this.sockets).length === 0) {
    throw new Error('No sockets available, cannot start.');
  }
};
/* eslint-enable @typescript-eslint/no-unsafe-argument */
/* eslint-enable @typescript-eslint/no-unsafe-call */

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
  } catch {
    console.warn('No SSDP sockets were created; SSDP discovery is disabled.');
  }
};

/**
 * @type {Express.ErrorRequestHandler}
 */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
const logErrors = (error, _req, res, next) => {
  console.log(error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500);
  res.json({ error: String(error) || 'Unexpected error' });
};
/* eslint-enable @typescript-eslint/no-unsafe-return */
/* eslint-enable @typescript-eslint/no-unsafe-call */

export const setupHttpServer = async ({ port = 0 } = {}) => {
  const app = express();
  const server = http.createServer(app).listen({ port });

  port = server.address().port;
  await setupSSDPDiscovery(port);

  app.set('port', port);

  app.use(
    express.raw({ type: 'application/skybrush-compiled', limit: '16mb' })
  );

  app.use('/api/v1', apiV1);

  app.use(logErrors);
};

export default setupHttpServer;
