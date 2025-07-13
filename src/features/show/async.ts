import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  CameraType,
  type Camera,
  type ShowSpecification,
} from '@skybrush/show-format';

import { SHARED_CAMERA_NAME_PLACEHOLDER } from '~/constants';

import type { ShowLoadingRequest } from './types';

export const _doLoadShow = createAsyncThunk(
  'show/load',
  async ({
    initialCameraPose,
    show,
    source,
  }: ShowLoadingRequest): Promise<ShowSpecification> => {
    if (typeof show === 'function') {
      show = await show();
    }

    if (initialCameraPose) {
      // User specified an initial camera pose, let's add it to the show
      const initialCamera: Camera = {
        type: CameraType.PERSPECTIVE,
        name: SHARED_CAMERA_NAME_PLACEHOLDER,
        position: initialCameraPose.position,
        orientation: initialCameraPose.orientation,
        default: true,
      };
      show = {
        ...show,
        environment: {
          ...show?.environment,
          cameras: [initialCamera, ...(show?.environment?.cameras ?? [])],
        },
      };
    }

    return show;
  }
);

export const withProgressIndicator = createAsyncThunk(
  'show/withProgressIndicator',
  async <T>(promise: any): Promise<T> => promise
) as any;
