import { t } from 'i18next';
import { Base64 } from 'js-base64';
import toast from 'react-hot-toast';

import {
  threeJsToSkybrushPosition,
  threeJsToSkybrushQuaternion,
  type Pose,
  type ThreeJsPositionTuple,
  type ThreeJsQuaternionTuple,
} from '@skybrush/aframe-components/lib/spatial';
import { getElapsedSeconds } from '~/features/playback/selectors';
import type { AppThunk } from '~/store';
import { findSceneCamera } from '~/views/player/utils';

const toWXYZ = (xyzw: number[]): number[] => [xyzw[3], ...xyzw.slice(0, 3)];

export function getSharingLink(): AppThunk {
  return async (dispatch, getState) => {
    const state = getState();
    const playbackPosition = getElapsedSeconds(state);
    const url = new URL(window.location.href);
    const camera = findSceneCamera();

    if (playbackPosition > 0) {
      url.searchParams.set('t', playbackPosition.toString());
    }

    if (camera) {
      const pose: Pose = {
        position: threeJsToSkybrushPosition(
          camera.position.toArray() as ThreeJsPositionTuple
        ),
        orientation: threeJsToSkybrushQuaternion(
          toWXYZ(
            camera.quaternion.toArray() as number[]
          ) as ThreeJsQuaternionTuple
        ),
      };

      url.searchParams.set(
        'p',
        Base64.encodeURI(
          JSON.stringify({
            p: pose.position.map((x) => Number(x.toFixed(2))),
            q: pose.orientation.map((x) => Number(x.toFixed(3))),
          })
        )
      );
    }

    await toast.promise(
      navigator.clipboard.writeText(url.toString()),
      {
        loading: t('sharing.copyLinkToClipboard.loading'),
        success: t('sharing.copyLinkToClipboard.success'),
        error: t('sharing.copyLinkToClipboard.error'),
      },
      {
        duration: 3000,
      }
    );
  };
}
