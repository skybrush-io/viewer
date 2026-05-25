import type { Component, Entity } from 'aframe';
import AFrame from 'aframe';
import { TilesRenderer } from '3d-tiles-renderer';
import { GoogleCloudAuthPlugin } from '3d-tiles-renderer/core/plugins';
import { CesiumIonAuthPlugin, CesiumIonOverlay, ImageOverlayPlugin, QuantizedMeshPlugin, LoadRegionPlugin, SphereRegion } from '3d-tiles-renderer/three/plugins';
import { WGS84_ELLIPSOID } from '3d-tiles-renderer/three';
import { AmbientLight, DirectionalLight, Sphere, Vector3 } from 'three';

import { egm96ToEllipsoid } from 'egm96-universal';

import { computeEcefToSkybrushTransform } from '~/geo/coordinates';

type TerrainTilesComponent = Component & {
  _tilesRenderer: TilesRenderer | null;
  _tilesetUrl: string;
  _token: string;
  _cesiumAssetId: number;
  _originLat: number;
  _originLon: number;
  _originAlt: number;
  _orientation: number;
  _resolutionSet: boolean;
  _initRenderer(): void;
  _disposeRenderer(): void;
};

function toEllipsoidalHeight(
  lat: number,
  lon: number,
  amslAlt: number
): number {
  return egm96ToEllipsoid(lat, lon, amslAlt);
}

function initIonTiles(
  component: TerrainTilesComponent,
  assetId: number,
  accessToken: string
) {
  const tilesRenderer = new TilesRenderer('');
  tilesRenderer.registerPlugin(
    new CesiumIonAuthPlugin({
      apiToken: accessToken,
      assetId: String(assetId),
      autoRefreshToken: true,
      useRecommendedSettings: true,
      assetTypeHandler: (type, renderer) => {
        if (type === 'TERRAIN') {
          renderer.registerPlugin(new QuantizedMeshPlugin({}));
        }
      },
    })
  );

  // Compute ECEF position of the show origin so that LoadRegionPlugin can
  // force-load tiles in that area (the plugin works in tile tree's local
  // coordinate system, i.e. ECEF for Cesium World Terrain)
  const ellipsoidalAlt = toEllipsoidalHeight(
    component._originLat,
    component._originLon,
    component._originAlt
  );
  const originEcef = new Vector3();
  WGS84_ELLIPSOID.getCartographicToPosition(
    component._originLat * Math.PI / 180,
    component._originLon * Math.PI / 180,
    ellipsoidalAlt,
    originEcef
  );

  const regionPlugin = new LoadRegionPlugin();
  regionPlugin.addRegion(
    new SphereRegion({
      sphere: new Sphere(originEcef, 5000),
      mask: true,
      errorTarget: 16,
    })
  );
  tilesRenderer.registerPlugin(regionPlugin);

  finishInit(component, tilesRenderer);
}

function initDirectTiles(component: TerrainTilesComponent, url: string) {
  const isGoogleUrl = url.includes('tile.googleapis.com');

  if (isGoogleUrl) {
    const urlObj = new URL(url);
    const googleKey = urlObj.searchParams.get('key') || component._token;

    if (!googleKey) {
      finishInit(component, new TilesRenderer(url));
      return;
    }

    const tilesRenderer = new TilesRenderer(url);
    tilesRenderer.registerPlugin(
      new GoogleCloudAuthPlugin({
        apiToken: googleKey,
        autoRefreshToken: true,
        useRecommendedSettings: true,
      })
    );
    finishInit(component, tilesRenderer);
  } else {
    const finalUrl = component._token && !url.includes('cesium.com')
      ? url
      : url;
    const tilesRenderer = new TilesRenderer(finalUrl);
    if (component._token) {
      tilesRenderer.fetchOptions.headers = {
        Authorization: `Bearer ${component._token}`,
      };
    }
    finishInit(component, tilesRenderer);
  }
}

function finishInit(
  component: TerrainTilesComponent,
  tilesRenderer: TilesRenderer
) {
  const sceneEl = (component.el as Entity).sceneEl;
  if (!sceneEl) {
    console.warn('[terrain-tiles] No sceneEl available');
    return;
  }

  const camera = sceneEl.camera;
  const renderer = sceneEl.renderer;
  if (!camera || !renderer) {
    console.warn('[terrain-tiles] No camera or renderer available');
    return;
  }

  // CWT terrain uses MeshStandardMaterial which needs scene lights
  const ambient = new AmbientLight(0xffffff, 0.6);
  sceneEl.object3D.add(ambient);
  const sun = new DirectionalLight(0xffffff, 1.0);
  sun.position.set(100, 200, 100);
  sceneEl.object3D.add(sun);
  sceneEl.object3D.add(sun.target);

  // Drape satellite imagery (Bing Maps Aerial) over terrain tiles via Cesium Ion
  if (component._token) {
    const imagery = new ImageOverlayPlugin({ overlays: [], renderer });
    imagery.addOverlay(
      new CesiumIonOverlay({
        assetId: 2,
        apiToken: component._token,
        autoRefreshToken: true,
      })
    );
    tilesRenderer.registerPlugin(imagery);
  }

  tilesRenderer.setCamera(camera);
  tilesRenderer.setResolutionFromRenderer(camera, renderer);

  const ellipsoidalAlt = toEllipsoidalHeight(
    component._originLat,
    component._originLon,
    component._originAlt
  );

  const transform = computeEcefToSkybrushTransform(
    component._originLat,
    component._originLon,
    ellipsoidalAlt,
    component._orientation
  );

  tilesRenderer.addEventListener('load-root-tileset', () => {
    tilesRenderer.group.applyMatrix4(transform);
  });

  tilesRenderer.addEventListener('load-error', (event: any) => {
    console.error('[terrain-tiles] Tile load error:', event);
  });

  (component.el as Entity).object3D.add(tilesRenderer.group);
  component._tilesRenderer = tilesRenderer;
}

if (AFrame.components?.['terrain-tiles']) {
  delete AFrame.components['terrain-tiles'];
}
AFrame.registerComponent('terrain-tiles', {
  schema: {
    url: { type: 'string' },
    token: { type: 'string' },
    cesiumAssetId: { type: 'number', default: 0 },
    originLat: { type: 'number' },
    originLon: { type: 'number' },
    originAlt: { type: 'number', default: 0 },
    orientation: { type: 'number', default: 0 },
  },

  init(this: TerrainTilesComponent) {
    this._tilesRenderer = null;
    this._tilesetUrl = '';
    this._token = '';
    this._cesiumAssetId = 0;
    this._originLat = 0;
    this._originLon = 0;
    this._originAlt = 0;
    this._orientation = 0;
    this._resolutionSet = false;
  },

  update(this: TerrainTilesComponent) {
    const data = this.data as TerrainTilesComponent['data'];

    const changed =
      data.url !== this._tilesetUrl ||
      data.token !== this._token ||
      data.cesiumAssetId !== this._cesiumAssetId ||
      data.originLat !== this._originLat ||
      data.originLon !== this._originLon ||
      data.originAlt !== this._originAlt ||
      data.orientation !== this._orientation;

    if (!changed) {
      return;
    }

    this._tilesetUrl = data.url as string;
    this._token = data.token as string;
    this._cesiumAssetId = data.cesiumAssetId as number;
    this._originLat = data.originLat as number;
    this._originLon = data.originLon as number;
    this._originAlt = data.originAlt as number;
    this._orientation = data.orientation as number;

    this._disposeRenderer();
    this._initRenderer();
  },

  tick(this: TerrainTilesComponent, _time: number, _delta: number) {
    const tilesRenderer = this._tilesRenderer;
    if (!tilesRenderer) {
      return;
    }

    const camera = (this.el as Entity).sceneEl?.camera;
    if (camera) {
      tilesRenderer.setCamera(camera);
      if (!this._resolutionSet) {
        const sceneRenderer = (this.el as Entity).sceneEl?.renderer;
        if (sceneRenderer) {
          tilesRenderer.setResolutionFromRenderer(camera, sceneRenderer);
          this._resolutionSet = true;
        }
      }
      camera.updateMatrixWorld();
    }

    tilesRenderer.update();
  },

  remove(this: TerrainTilesComponent) {
    this._disposeRenderer();
  },

  _initRenderer(this: TerrainTilesComponent) {
    if (this._token && !this._tilesetUrl) {
      const assetId = this._cesiumAssetId || 1;
      initIonTiles(this, assetId, this._token);
    } else if (this._tilesetUrl) {
      initDirectTiles(this, this._tilesetUrl);
    }
  },

  _disposeRenderer(this: TerrainTilesComponent) {
    if (this._tilesRenderer) {
      (this.el as Entity).object3D.remove(this._tilesRenderer.group);
      this._tilesRenderer = null;
    }
  },
});
