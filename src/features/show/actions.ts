import {
  loadCompiledShow,
  type AudioData,
  type ShowSpecification,
} from '@skybrush/show-format';

import { addRecentFile } from '~/features/ui/slice';
import type { AppThunk } from '~/store';
import { getElectronBridge } from '~/window';

import { withProgressIndicator } from './async';
import { loadShowFromRequest } from './slice';

type AudioSpecWithUrl = Omit<AudioData, 'data'> & {
  data?: AudioData['data'];
  url: string;
};

const loadShowFromBufferInner = async (buffer: Buffer) => {
  const { setAudioBuffer } = getElectronBridge() ?? {};
  const showSpec = await loadCompiledShow(buffer, { assets: true });

  const audioSpec = showSpec?.media?.audio;
  const { data: audioData, mediaType } = audioSpec ?? {};

  // We can't use the audio directly; we need to save it to a file and then use a
  // URL pointing to that file
  if (audioData && audioSpec) {
    if (setAudioBuffer) {
      const url = await setAudioBuffer(0, {
        data: audioData,
        mediaType: mediaType ?? 'audio/mpeg',
      });

      const audioSpecWithUrl = audioSpec as AudioSpecWithUrl;
      delete audioSpecWithUrl.data;

      // Attach the timestamp to the end of the URL to ensure that the
      // AudioController in the app gets a new URL even if it refers to the
      // same audio buffer (because the audio content is different)
      audioSpecWithUrl.url = url + '?ts=' + Date.now();
    } else {
      console.warn(
        'Embedded audio files are not supported in this environment'
      );
    }
  }

  return showSpec;
};

export const loadShowFromBuffer =
  (buffer: Buffer): AppThunk =>
  async (dispatch) => {
    const loadAction = await dispatch(
      withProgressIndicator(() => loadShowFromBufferInner(buffer))
    );
    const show: ShowSpecification = loadAction.payload as ShowSpecification;
    dispatch(loadShowFromRequest({ show, source: { type: 'buffer' } }));
  };

export const loadShowFromLocalFile =
  (filename: string): AppThunk =>
  async (dispatch) => {
    const { readFile, setTitle } = getElectronBridge() ?? {};
    if (!readFile) {
      console.warn(
        'Loading shows from local files is not supported in this environment'
      );
      return;
    }

    const loadAction = await dispatch(
      withProgressIndicator(async () => {
        const buffer = await readFile(filename);
        const result = await loadShowFromBufferInner(buffer);
        if (setTitle) {
          await setTitle({ representedFile: filename });
        }
        return result;
      })
    );
    const show: ShowSpecification = loadAction.payload as ShowSpecification;
    dispatch(loadShowFromRequest({ show, source: { type: 'file', filename } }));

    dispatch(addRecentFile(filename));
  };

export const loadShowFromObject =
  (show: ShowSpecification): AppThunk =>
  (dispatch) => {
    dispatch(loadShowFromRequest({ show, source: { type: 'object' } }));
  };

export const pickLocalFileAndLoadShow = (): AppThunk => async (dispatch) => {
  const { readFile, selectLocalShowFileForOpening } = getElectronBridge() ?? {};

  if (selectLocalShowFileForOpening && readFile) {
    const filename = await selectLocalShowFileForOpening();
    if (filename) {
      dispatch(loadShowFromLocalFile(filename));
    }
  }
};

export const reloadShow = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const source = state.show.source;

  if (source.type === 'file') {
    dispatch(loadShowFromLocalFile(source.filename));
  }

  // We cannot reload from this source, so we just return.
  console.warn(`Cannot reload show from source of type ${source.type}`);
};
