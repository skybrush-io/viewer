// Make .mp3 imports work nicely with Typescript
declare module '*.mp3' {
  const value: string;
  export default value;
}

// Make PNG imports work nicely with Typescript
declare module '*.png' {
  const value: string;
  export default value;
}

// Make .obj imports work nicely with Typescript
declare module '*.obj' {
  const value: string;
  export default value;
}

// Provide typings for @skybrush/aframe-components
declare module '@skybrush/aframe-components' {
  export function objectToString(object: any): string;
}

// Provide typings for @skybrush/aframe-components/lib/spatial
declare module '@skybrush/aframe-components/lib/spatial' {
  type EulerRotation = [number, number, number];
  type Position = [number, number, number];
  type Quaternion = [number, number, number, number];
  type Pose = {
    position: Position;
    orientation: Quaternion;
  };

  type ThreeJsPositionTuple = [number, number, number];
  type ThreeJsQuaternionTuple = [number, number, number, number];
  type ThreeJsRotationTuple = [number, number, number];
  type ThreeJsPose = {
    position: ThreeJsPositionTuple;
    rotation: ThreeJsRotationTuple;
  };

  export function skybrushRotationToQuaternion(
    rotation: EulerRotation
  ): Quaternion;
  export function skybrushQuaternionToThreeJsRotation(
    quaternion: Quaternion
  ): ThreeJsRotationTuple;
  export function skybrushToThreeJsPose(pose: Pose): ThreeJsPose;
  export function skybrushToThreeJsPosition(
    position: Position
  ): ThreeJsPositionTuple;
  export function skybrushToThreeJsQuaternion(
    quaternion: Quaternion
  ): ThreeJsQuaternionTuple;

  export function threeJsToSkybrushPose(pose: ThreeJsPose): Pose;
  export function threeJsToSkybrushPosition(
    position: ThreeJsPositionTuple
  ): Position;
  export function threeJsToSkybrushQuaternion(
    quaternion: ThreeJsQuaternionTuple
  ): Quaternion;
}
