import { setTimeout } from 'node:timers/promises';

import { ipcMain as ipc } from 'electron-better-ipc';
import express from 'express';

import { getFirstMainWindow } from './utils.mjs';
import { setTitle } from './window-title.mjs';

const router = express.Router();

router.post('/focus', (req, res, next) => {
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

router.post('/load', (req, res, next) => {
  if (!req.is('application/skybrush-compiled')) {
    return res.sendStatus(400);
  }

  try {
    const proposedTitle = req.header('x-skybrush-viewer-title');
    const targetWindow = getFirstMainWindow({ required: true });

    Promise.race([
      (async () => {
        await ipc.callRenderer(targetWindow, 'loadShowFromBuffer', req.body);
        await ipc.callRenderer(targetWindow, 'setUIMode', 'validation');

        setTitle(targetWindow, {
          representedFile: null,
          alternateFile: proposedTitle || null,
        });

        targetWindow.show();

        return true;
      })(),
      setTimeout(10000, false),
    ])
      .then((success) => {
        if (success) {
          res.json({ result: true });
        } else {
          throw new Error('Timeout');
        }
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    return next(error);
  }
});

router.get('/ping', (_req, res) => {
  res.json({ result: true });
});

export default router;
