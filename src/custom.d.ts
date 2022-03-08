// Make PNG imports work nicely with Typescript
declare module '*.png' {
  const value: string;
  export default value;
}

// Custom elements used by A-Frame
declare namespace JSX {
  interface IntrinsicElements {
    'a-assets': any;
    'a-camera': any;
    'a-drone-flock': any;
    'a-entity': any;
    'a-scene': any;
  }
}

// Provide typings for configuration
declare module 'config' {
  const config: {
    buttons: {
      playbackHint?: boolean;
    };
    io: {
      localFiles: boolean;
    };
    modes: {
      player: boolean;
      validation: boolean;
      vr: boolean;
    };
    useWelcomeScreen: boolean;
  };
  export default config;
}

// Provide typings for @skybrush/show-format
declare module '@skybrush/show-format' {
  type DroneSpecification = any;
  type ShowSpecification = any;
  type ThreeJsVector = {
    [key: string]: number;
    x: number;
    y: number;
    z: number;
  };
  type Vector = [number, number, number];

  export interface CameraSpecification {
    type?: 'perspective';
    name?: string;
    position: Vector;
    orientation: [number, number, number, number];
    default?: boolean;
  }

  export type TrajectoryKeypoint = [number, Vector, Vector[]];

  export interface Trajectory {
    version: number;
    points: TrajectoryKeypoint[];
    takeoffTime?: number;
    landingTime?: number;
  }

  export interface TrajectoryPlayer {
    getPositionAt: (time: number, result: ThreeJsVector) => ThreeJsVector;
    getVelocityAt: (time: number, result: ThreeJsVector) => ThreeJsVector;
    getVelocityFromRightAt: (
      time: number,
      result: ThreeJsVector
    ) => ThreeJsVector;
  }

  export function createTrajectoryPlayer(
    trajectory: Trajectory
  ): TrajectoryPlayer;
  export function getCamerasFromShowSpecification(
    spec: ShowSpecification
  ): CameraSpecification[];
  export function validateTrajectory(
    trajectory: any
  ): asserts trajectory is Trajectory;
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
  type ThreeJsPosition = [number, number, number];
  type ThreeJsQuaternion = [number, number, number, number];
  type ThreeJsRotation = [number, number, number];

  export function skybrushRotationToQuaternion(
    rotation: EulerRotation
  ): Quaternion;
  export function skybrushQuaternionToThreeJsRotation(
    quaternion: Quaternion
  ): ThreeJsRotation;
  export function skybrushToThreeJsPosition(
    position: Position
  ): ThreeJsPosition;
  export function skybrushToThreeJsQuaternion(
    quaternion: Quaternion
  ): ThreeJsQuaternion;
}
