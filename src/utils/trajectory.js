/**
 * Class that takes a trajectory object as its first argument and that can
 * tell the position of the drone traversing the trajeectoty at any given
 * time instant.
 */
class TrajectoryPlayer {
  /**
   * Constructor.
   *
   * @param {object} trajectory  the trajectory to evaluate, in Skybrush format
   */
  constructor(trajectory) {
    if (trajectory.version !== 1) {
      throw new Error('only version 1 trajectories are supported');
    }

    const items = trajectory.points;

    // TODO(ntamas): more thorough validation here!

    this._takeoffTime = trajectory.takeoffTime || 0;
    this._numSegments = items.length;
    this._startTimes = items.map(item => item[0] + this._takeoffTime);
    this._segments = items.map(item => item.slice(1));

    const firstPoint = this._numSegments > 0 ? this._segments[0][0] : [0, 0, 0];
    const lastPoint =
      this._numSegments > 0
        ? this._segments[this._numSegments - 1][0]
        : [0, 0, 0];

    this._segmentFuncs = [];
    this._segmentFuncs.length = this._numSegments;

    this._specialSegmentFuncs = {
      beforeFirst: createConstantSegmentFunction(firstPoint),
      afterLast: createConstantSegmentFunction(lastPoint)
    };

    this._reset();
  }

  /**
   * Returns the position of the drone at the given time instant.
   *
   * @param {number}        time    the time instant, measured in seconds
   * @param {THREE.Vector}  result  the vector that should be updated with the
   *        position
   */
  getPositionAt(time, result) {
    let ratio;

    this._seekTo(time);

    if (this._currentSegmentLength > 0) {
      ratio =
        (time - this._currentSegmentStartTime) / this._currentSegmentLength;
    } else {
      ratio = 0;
    }

    this._currentSegmentFunc(result, ratio);
  }

  /**
   * Returns whether the given timestamp is before the takeoff time.
   */
  isBeforeTakeoff(time) {
    return time < this._takeoffTime;
  }

  _reset() {
    this._selectSegment(-1);
  }

  /**
   * Updates the state variables of the current trajectory if needed to
   * ensure that its current segment includes the given time.
   *
   * @param  {number} time  the timestamp to seek to
   */
  _seekTo(time) {
    if (time >= this._currentSegmentStartTime) {
      if (time <= this._currentSegmentEndTime) {
        // We are done.
        return;
      }

      if (this._segmentIndex < this._numSegments - 1) {
        // Maybe we only need to step to the next segment? This is the common
        // case.
        const nextEnd = this._startTimes[this._segmentIndex + 1];
        if (nextEnd >= time) {
          // We are done.
          this._selectSegment(this._segmentIndex + 1);
        }
      } else {
        // Reached the end of the trajectory
        this._selectSegment(this._numSegments);
      }
    }

    // Do things the hard way, with binary search
    const index = bisect(this._startTimes, time);
    this._selectSegment(index - 1);
  }

  /**
   *  Updates the state variables of the current trajectory if needed to ensure
   *  that the segmet with the given index is the one that is currently
   *  selected.
   */
  _selectSegment(index) {
    this._segmentIndex = index;

    if (index < 0) {
      this._currentSegment = undefined;
      this._currentSegmentLength = 0;
      this._currentSegmentStartTime = Number.NEGATIVE_INFINITY;
      this._currentSegmentEndTime =
        this._numSegments > 0 ? this._startTimes[0] : Number.POSITIVE_INFINITY;
      this._currentSegmentFunc = this._specialSegmentFuncs.beforeFirst;
    } else if (index >= this._numSegments) {
      this._currentSegment = undefined;
      this._currentSegmentLength = 0;
      this._currentSegmentEndTime = Number.POSITIVE_INFINITY;
      this._currentSegmentStartTime =
        this._numSegments > 0
          ? this._startTimes[this._numSegments - 1]
          : Number.NEGATIVE_INFINITY;
      this._currentSegmentFunc = this._specialSegmentFuncs.afterLast;
    } else {
      this._currentSegment = this._segments[index];
      this._currentSegmentStartTime = this._startTimes[index];

      if (index < this._numSegments - 1) {
        this._currentSegmentEndTime = this._startTimes[index + 1];
        this._currentSegmentLength =
          this._currentSegmentEndTime - this._currentSegmentStartTime;
      } else {
        this._currentSegmentEndTime = Number.POSITIVE_INFINITY;
        this._currentSegmentLength = 0;
      }

      if (!this._segmentFuncs[index]) {
        if (index < this._numSegments - 1) {
          this._segmentFuncs[index] = createSegmentFunction(
            this._currentSegment[0],
            this._segments[index + 1][0],
            this._currentSegment[1]
          );
        } else {
          this._segmentFuncs[index] = createConstantSegmentFunction(
            this._currentSegment[0]
          );
        }
      }

      this._currentSegmentFunc = this._segmentFuncs[index];
    }
  }
}

/**
 * Port of Python's `bisect.bisect` into JavaScript.
 */
function bisect(items, x, lo = 0, hi = items.length) {
  if (lo < 0) {
    throw new Error('lo must be non-negative');
  }

  while (lo < hi) {
    const mid = ((lo + hi) / 2) | 0;

    if (x < items[mid]) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }

  return lo;
}

function createConstantSegmentFunction(point) {
  const [x, y, z] = point;

  return function(vec) {
    vec.set(x, y, z);
  };
}

function createSegmentFunction(start, end, controlPoints) {
  if (controlPoints && controlPoints.length > 0) {
    // TODO(ntamas)
    throw new Error('Control points not supported yet');
  }

  const [x, y, z] = start;
  const dx = end[0] - x;
  const dy = end[1] - y;
  const dz = end[2] - z;

  return function(vec, ratio) {
    vec.set(x + ratio * dx, y + ratio * dy, z + ratio * dz);
  };
}

/**
 * Factory function that creates a new trajectory player object with a
 * single `getPositionAt()` function that evaluates the trajectory at a given
 * timestamp.
 */
export default function createTrajectoryPlayer(trajectory) {
  const player = new TrajectoryPlayer(trajectory);

  return {
    getPositionAt: player.getPositionAt.bind(player)
  };
}
