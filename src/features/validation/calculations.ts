import type { Vector3, Vector3Array } from '@skybrush/show-format';

/**
 * Calculates the derivative of a vector of scalars where the derivative at
 * index i is estimated from the values at indices (i-k) and (i+k), i.e. we
 * are using the midpoint method with a step size of k.
 */
export function calculateScalarDerivative(
  values: number[],
  numSteps = 1,
  dt = 1
): number[] {
  const n = values.length;
  const result: number[] = Array.from({ length: n });
  const scale = 2 * numSteps * dt;
  for (let i = numSteps; i < n - numSteps; i++) {
    result[i] = (values[i + numSteps] - values[i - numSteps]) / scale;
  }

  // Fill the endpoints
  if (n >= 2 * numSteps + 1) {
    for (let i = 0; i < numSteps; i++) {
      result[i] = result[numSteps];
      result[n - i - 1] = result[n - numSteps - 1];
    }
  } else {
    result.fill(0);
  }

  return result;
}

/**
 * Calculates the derivative of an array of 3D vectors where the derivative at
 * index i is estimated from the vectors at indices (i-k) and (i+k), i.e. we
 * are using the midpoint method with a step size of k.
 */
export function calculateVectorDerivative(
  values: Vector3[],
  numSteps = 1,
  dt = 1
): Vector3[] {
  const n = values.length;
  const result: Vector3[] = Array.from({ length: n });
  const scale = 2 * numSteps * dt;
  for (let i = numSteps; i < n - numSteps; i++) {
    result[i] = {
      x: (values[i + numSteps].x - values[i - numSteps].x) / scale,
      y: (values[i + numSteps].y - values[i - numSteps].y) / scale,
      z: (values[i + numSteps].z - values[i - numSteps].z) / scale,
    };
  }

  // Fill the endpoints
  if (n >= 2 * numSteps + 1) {
    for (let i = 0; i < numSteps; i++) {
      result[i] = result[numSteps];
      result[n - i - 1] = result[n - numSteps - 1];
    }
  } else {
    const ZERO = { x: 0, y: 0, z: 0 };
    result.fill(ZERO);
  }

  return result;
}

/**
 * Projects multiple 3D vectors in a Vector3Array to the XY plane and returns the lengths
 * of the projected vectors.
 */
export const projectVector3ArrayToXY = (vectors: Vector3Array) => {
  const xs = vectors.getX();
  const ys = vectors.getY();
  const result: number[] = Array.from({ length: vectors.length });
  for (let i = 0; i < vectors.length; i++) {
    result[i] = Math.hypot(xs[i], ys[i]);
  }
  return result;
};

/**
 * Projects multiple 3D vectors in a Vector3Array to the Z axis and returns the lengths
 * of the projected vectors.
 */
export const projectVector3ArrayToZ = (vectors: Vector3Array) =>
  Array.from(vectors.getZ());
