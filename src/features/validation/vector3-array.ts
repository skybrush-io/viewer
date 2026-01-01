import type { Vector3 } from '@skybrush/show-format';

export type Vector3ArrayOptions = {
  factory?: (length: number) => Float32Array;
};

export type DerivativeOptions = {
  numSteps?: number;
  dt?: number;
};

export type StrideOptions = {
  start?: number;
  step?: number;
};

const newFloat32Array = (length: number) => new Float32Array(length);

/**
 * Storage for an array of 3D vectors, backed by a Float32Array.
 */
export class Vector3Array {
  private _data: Float32Array;

  constructor(length: number, options: Vector3ArrayOptions = {}) {
    const { factory = newFloat32Array } = options;
    this._data = factory(length * 3);
  }

  static from(data: Float32Array) {
    if (data instanceof Float32Array) {
      const numRows = Math.floor(data.length / 3);
      const result = new Vector3Array(numRows);
      result._data = data.slice(0, numRows * 3);
      return result;
    }

    throw new Error('Cannot convert object to Vector3Array');
  }

  /**
   * Returns the underlying ArrayBuffer of the data.
   */
  get buffer(): ArrayBufferLike {
    return this._data.buffer;
  }

  /**
   * Returns the number of vectors in the array.
   */
  get length(): number {
    return this._data.length / 3;
  }

  /**
   * Returns the vector at the specified index.
   * @param index - The index of the vector to retrieve. Negative indices count from the end.
   */
  at(index: number): Vector3 | undefined {
    if (index < 0) {
      index += this.length;
    }
    if (index < 0 || index >= this.length) {
      return undefined;
    }
    return this.get(index);
  }

  /**
   * Returns the vector at the specified index.
   * @param index - The index of the vector to retrieve.
   */
  get(index: number): Vector3 {
    const i3 = index * 3;
    return {
      x: this._data[i3],
      y: this._data[i3 + 1],
      z: this._data[i3 + 2],
    };
  }

  /**
   * Copies the vector at the specified index into a pre-allocated Vector3 object.
   */
  getInto(dest: Vector3, index: number): void {
    const i3 = index * 3;
    dest.x = this._data[i3];
    dest.y = this._data[i3 + 1];
    dest.z = this._data[i3 + 2];
  }

  /**
   * Copies the vector at the specified index into a pre-allocated array.
   */
  getIntoArray(dest: number[], index: number): void {
    const i3 = index * 3;
    dest[0] = this._data[i3];
    dest[1] = this._data[i3 + 1];
    dest[2] = this._data[i3 + 2];
  }

  /**
   * Returns the X components of all vectors as a Float32Array.
   */
  getX(): Float32Array {
    return this._getColumn(0);
  }

  /**
   * Returns the Y components of all vectors as a Float32Array.
   */
  getY(): Float32Array {
    return this._getColumn(1);
  }

  /**
   * Returns the Z components of all vectors as a Float32Array.
   */
  getZ(): Float32Array {
    return this._getColumn(2);
  }

  /**
   * Returns the X, Y, or Z components of all vectors as a Float32Array.
   */
  private _getColumn(col: 0 | 1 | 2): Float32Array {
    const n = this._data.length;
    const result: Float32Array = new Float32Array(this.length);
    let j = 0;
    for (let i = col; i < n; i += 3) {
      result[j] = this._data[i];
      j++;
    }
    return result;
  }

  /**
   * Sets the vector at the specified index.
   * @param index - The index of the vector to set.
   * @param value - The new vector.
   */
  set(index: number, value: Vector3): void {
    const i3 = index * 3;
    this._data[i3] = value.x;
    this._data[i3 + 1] = value.y;
    this._data[i3 + 2] = value.z;
  }

  /**
   * Copies the vectors in this Vector3Array into another Vector3Array, with an
   * optional stride.
   */
  copyInto(dest: Vector3Array, options: StrideOptions): void {
    const { start = 0, step = 1 } = options;
    const n = this.length;

    let srcIndex = 0;
    let destIndex = start * 3;
    const destStep = step * 3;
    for (let i = 0; i < n; i++) {
      dest._data[destIndex] = this._data[srcIndex];
      dest._data[destIndex + 1] = this._data[srcIndex + 1];
      dest._data[destIndex + 2] = this._data[srcIndex + 2];

      srcIndex += 3;
      destIndex += destStep;
    }
  }

  /**
   * Fills all vectors in the array with a single scalar, in-place.
   * @param scalar - The scalar to fill the vectors with.
   * @returns The modified Vector3Array (this).
   */
  fillWithScalar(scalar: number): this {
    this._data.fill(scalar);
    return this;
  }

  /**
   * Adds a scalar to all vectors in the array, in-place.
   * @param scalar - The scalar to add to the vectors.
   * @returns The modified Vector3Array (this).
   */
  addScalar(scalar: number): this {
    if (scalar !== 0) {
      const n = this._data.length;
      for (let i = 0; i < n; i++) {
        this._data[i] += scalar;
      }
    }
    return this;
  }

  /**
   * Multiply all vectors in the array with a scalar, in-place.
   * @param scalar - The scalar to multiply the vectors with.
   * @returns The modified Vector3Array (this).
   */
  multiplyWithScalar(scalar: number): this {
    if (scalar === 0) {
      return this.fillWithScalar(0);
    }

    if (scalar !== 1) {
      const n = this._data.length;
      for (let i = 0; i < n; i++) {
        this._data[i] *= scalar;
      }
    }

    return this;
  }

  /**
   * Calculates the derivative of the Vector3Array where the derivative at
   * index i is estimated from the vectors at indices (i-k) and (i+k), i.e. we
   * are using the midpoint method with a step size of k.
   *
   * @param numSteps - steps to take in the past and future for the derivative.
   *        Must be positive.
   * @param dt - time difference between steps (default: 1)
   * @returns a new Vector3Array containing the derivatives.
   */
  derivative(options: DerivativeOptions): Vector3Array {
    const { numSteps = 1, dt = 1 } = options;
    if (numSteps <= 0) {
      throw new Error('numSteps must be positive');
    }

    const scale = 2 * numSteps * dt;

    const result = new Vector3Array(this.length);
    const n = this._data.length;
    const offset = 3 * numSteps;
    const end = n - offset;
    for (let i = offset; i < end; i++) {
      result._data[i] = this._data[i + offset] - this._data[i - offset] / scale;
    }

    // Fill the endpoints
    if (n >= 2 * numSteps + 1) {
      for (let i = 0; i < numSteps; i++) {
        for (let j = 0; j < 3; i++) {
          result._data[3 * i + j] = result._data[3 * numSteps + j];
          result._data[3 * (n - i - 1) + j] =
            result._data[3 * (n - numSteps - 1) + j];
        }
      }
    } else {
      result.fillWithScalar(0);
    }

    return result;
  }

  /**
   * Slices the Vector3Array from start to end indices and returns another Vector3Array.
   * @param start - The starting index (inclusive).
   * @param end - The ending index (exclusive).
   * @returns The sliced Vector3Array.
   */
  slice(start: number, end: number): Vector3Array {
    return Vector3Array.from(this._data.slice(start * 3, end * 3));
  }

  /**
   * Converts the Vector3Array into a regular array of Vector3 objects.
   * @returns the converted array of Vector3 objects
   */
  toArray(): Vector3[] {
    const result: Vector3[] = [];
    const n = this.length;
    for (let i = 0; i < n; i++) {
      result.push({
        x: this._data[i * 3],
        y: this._data[i * 3 + 1],
        z: this._data[i * 3 + 2],
      });
    }
    return result;
  }

  /**
   * Extracts the underlying Float32Array data, invalidating the Vector3Array.
   */
  release(): Float32Array {
    const data = this._data;
    this._data = new Float32Array(0);
    return data;
  }
}
