/* eslint-disable unicorn/prevent-abbreviations */
const express = require('express');
const http = require('http');
const SSDPServer = require('node-ssdp').Server;

const apiV1 = require('./api-v1');

// Monkey-patch SSDPServer._send so we never send advertisements and we respond
// to requests from our own IP only
const _originalSend = SSDPServer.prototype._send;
SSDPServer.prototype._send = function (message, host, port, cb) {
  if (typeof host === 'function') {
    // This is an advertisement
    cb = host;
    cb();
  } else if (host === '127.0.0.1') {
    // Regular message for localhost
    _originalSend.call(this, message, host, port, cb);
  } else {
    // Regular message for somewhere else; ignored
    cb();
  }
};

const setupSSDPDiscovery = (port) => {
  const UPNP_DEVICE_ID = `urn:collmot-com:device:skybrush-viewer:1`;
  const UPNP_SERVICE_ID = `urn:collmot-com:service:skyc-validator:1`;

  const location = `http://localhost:${port}`;
  const server = new SSDPServer({ location });

  server.addUSN(UPNP_DEVICE_ID);
  server.addUSN(UPNP_SERVICE_ID);

  server.start();

  process.on('exit', () => server.stop());
};

const setupHttpServer = ({ port = 0 } = {}) => {
  const app = express();
  const server = http.createServer(app).listen({ port });

  port = server.address().port;
  setupSSDPDiscovery(port);

  app.set('port', port);

  app.use(express.raw({ type: 'application/skybrush-compiled', limit: '8mb' }));

  app.use('/api/v1', apiV1);

  app.use((error, _req, res, next) => {
    console.log(error);

    if (res.headersSent) {
      return next(error);
    }

    res.status(500);
    res.json({ error: String(error) || 'Unexpected error' });
  });
};

module.exports = setupHttpServer;
