/* eslint-disable unicorn/prevent-abbreviations, new-cap */
const { setTimeout } = require('node:timers/promises');

const { ipcMain: ipc } = require('electron-better-ipc');
const express = require('express');

const { getShowAsObjectFromBuffer } = require('./show-loader');
const { getFirstMainWindow } = require('./utils');
const { setTitle } = require('./window-title');

const router = express.Router();

router.post('/focus', async (req, res, next) => {
  try {
    const targetWindow = getFirstMainWindow();
    if (targetWindow) {
      targetWindow.show();
    }

    res.json({ result: true });
  } catch (error) {
    return next(error);
  }
});

router.post('/load', async (req, res, next) => {
  if (!req.is('application/skybrush-compiled')) {
    return res.sendStatus(400);
  }

  try {
    const proposedTitle = req.header('x-skybrush-viewer-title');
    const targetWindow = getFirstMainWindow({ required: true });

    const success = Promise.race([
      (async () => {
        const showSpec = await getShowAsObjectFromBuffer(req.body);
        await ipc.callRenderer(targetWindow, 'setUIMode', 'validation');
        await ipc.callRenderer(targetWindow, 'loadShowFromObject', showSpec);

        setTitle(targetWindow, {
          representedFile: null,
          alternateFile: proposedTitle || null,
        });

        targetWindow.show();

        return true;
      })(),
      setTimeout(10000, false),
    ]);

    if (success) {
      res.json({ result: true });
    } else {
      throw new Error('Timeout');
    }
  } catch (error) {
    return next(error);
  }
});

router.get('/ping', (_req, res) => {
  res.json({ result: true });
});

module.exports = router;
