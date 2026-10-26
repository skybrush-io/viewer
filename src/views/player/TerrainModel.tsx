import { useEffect, useState } from 'react';

import { getTerrainModel } from '~/features/show/selectors';
import { skybrushQuaternionToEulerDegrees } from '~/features/show/utils';
import { useAppSelector } from '~/hooks/store';

/**
 * Component that renders the binary glTF terrain model of the loaded show
 * with the transform given in the show.
 *
 * The transform is given in show coordinates, so the component must be placed
 * inside the group of the 3D view that maps show coordinates to Three.js
 * coordinates.
 *
 * The component reads the terrain model from the store instead of receiving
 * it in its props. React's development build inspects the changed props of
 * every component for its performance tracks, and walking the elements of a
 * large binary model this way takes seconds.
 */
const TerrainModel = () => {
  const terrainModel = useAppSelector(getTerrainModel);
  const data = terrainModel?.data;
  const [url, setUrl] = useState<string | undefined>();

  // A-Frame can only load glTF models from URLs, so we create a blob URL for
  // the data and revoke it when the data changes or the component unmounts
  useEffect(() => {
    if (!data) {
      return;
    }

    // The show parser returns a Uint8Array<ArrayBufferLike>, but Blob does
    // not accept views of a SharedArrayBuffer, so the type needs narrowing
    const blob = new Blob([data as Uint8Array<ArrayBuffer>], {
      type: 'model/gltf-binary',
    });
    const objectUrl = URL.createObjectURL(blob);
    // eslint-disable-next-line @eslint-react/set-state-in-effect
    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [data]);

  if (!terrainModel || !url) {
    return null;
  }

  const { position, rotation, scale } = terrainModel;
  return (
    <a-entity
      position={position.join(' ')}
      rotation={skybrushQuaternionToEulerDegrees(rotation).join(' ')}
      scale={scale.join(' ')}
    >
      {/* glTF models are Y-up, but the show coordinate system is Z-up */}
      <a-entity rotation='90 0 0' gltf-model={url} />
    </a-entity>
  );
};

export default TerrainModel;
