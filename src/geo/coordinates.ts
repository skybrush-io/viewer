import { Matrix4, Vector3 } from 'three';
import { WGS84_ELLIPSOID } from '3d-tiles-renderer/three';

const DEG2RAD = Math.PI / 180;

export function computeEcefToSkybrushTransform(
  originLat: number,
  originLon: number,
  originAlt: number,
  orientation: number
): Matrix4 {
  const latRad = originLat * DEG2RAD;
  const lonRad = originLon * DEG2RAD;
  const alphaRad = orientation * DEG2RAD;
  const cosA = Math.cos(alphaRad);
  const sinA = Math.sin(alphaRad);

  const origin = new Vector3();
  WGS84_ELLIPSOID.getCartographicToPosition(latRad, lonRad, originAlt, origin);

  const east = new Vector3();
  const north = new Vector3();
  const up = new Vector3();
  // Use a temp vector for the surface point to avoid overwriting `origin`
  const surfacePoint = new Vector3();
  WGS84_ELLIPSOID.getEastNorthUpAxes(latRad, lonRad, east, north, up, surfacePoint);

  const fwd = new Vector3().copy(north).multiplyScalar(cosA).add(
    new Vector3().copy(east).multiplyScalar(sinA)
  );

  const left = new Vector3().copy(north).multiplyScalar(sinA).add(
    new Vector3().copy(east).multiplyScalar(-cosA)
  );

  const m = new Matrix4().set(
    fwd.x, fwd.y, fwd.z, -fwd.dot(origin),
    left.x, left.y, left.z, -left.dot(origin),
    up.x, up.y, up.z, -up.dot(origin),
    0, 0, 0, 1,
  );
  return m;
}
