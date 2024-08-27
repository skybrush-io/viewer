export type DroneModelType = 'sphere' | 'quad' | 'flapper';

export function isValidDroneModelType(value: string): value is DroneModelType {
  return value === 'sphere' || value === 'quad' || value === 'flapper';
}
