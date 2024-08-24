export type DroneModelType = 'sphere' | 'flapper';

export function isValidDroneModelType(value: string): value is DroneModelType {
  return value === 'sphere' || value === 'flapper';
}
