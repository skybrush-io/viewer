/* eslint-disable unicorn/prevent-abbreviations, new-cap */
const { BrowserWindow } = require('electron');
const { ipcMain: ipc } = require('electron-better-ipc');
const express = require('express');
const pTimeout = require('p-timeout');

const { loadShowFromBuffer } = require('./show-loader');

const router = express.Router();

router.post('/load', async (req, res, next) => {
  if (!req.is('application/skybrush-compiled')) {
    return res.sendStatus(400);
  }

  try {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length === 0) {
      throw new Error('All windows are closed');
    }

    const targetWindow = allWindows[0];

    await pTimeout(
      (async () => {
        const showSpec = await loadShowFromBuffer(req.body);
        await ipc.callRenderer(targetWindow, 'setUIMode', 'validation');
        await ipc.callRenderer(targetWindow, 'loadShowSpecification', showSpec);
      })(),
      10000
    );

    res.json({ result: true });
  } catch (error) {
    return next(error);
  }
});

router.get('/ping', (_req, res) => {
  res.json({ result: true });
});

module.exports = router;
