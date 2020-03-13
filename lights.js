const { Base64 } = require('js-base64');
const Deque = require('denque');

/**
 * Helper function that takes a base64-encoded string or an ArrayBuffer and
 * converts it into an Uint8Array.
 *
 * Also accepts Uint8Array objects as an input; returns the array intact if
 * this is the case.
 */
function convertLightProgramToUint8Array(input) {
  if (typeof input === 'string') {
    return Uint8Array.from(Base64.atob(input), char => char.charCodeAt(0));
  }

  if (input instanceof Uint8Array) {
    return input;
  }

  throw new Error('Unsupported input type for light program');
}

/**
 * State object for the light program executor. The state object essentially
 * covers a time interval in the execution and it consists of the following
 * components:
 *
 * - a timestamp
 * - a duration
 * - a start color that is valid at the given timestamp
 * - an optional end color; if it is specified, there is a fade from the given
 *   timestamp with the given duration, from the start color to the end color.
 *   If it is missing, the color is constant for the entire time interval.
 *
 * When the state is initialized, the timestamp is set to zero, the duration is
 * set to zero and the start color is set to black.
 */
class ExecutorState {
  /**
   * Constructor.
   */
  constructor() {
    this._startColor = [0, 0, 0];
    this._endColor = [0, 0, 0];
    this._isFade = false;

    this.timestamp = 0;
    this.duration = 0;
    this.endTime = 0;
  }

  /**
   * Returns the color that is valid at the start of the interval.
   */
  get startColor() {
    return this._startColor;
  }

  /**
   * Returns the color that is valid at the end of the interval.
   */
  get endColor() {
    return this._isFade ? this._endColor : this._startColor;
  }

  /**
   * Returns whether the current segment is a fade.
   */
  get isFade() {
    return this._isFade;
  }

  /**
   * Advances the state object with the given duration. Also copies the end
   * color to the start color if the previous state represented a fade.
   *
   * Returns the state object for easy chainability.
   */
  advanceTimeBy(duration) {
    let i;

    this.timestamp = this.endTime;
    this.duration = duration;
    this.endTime = this.timestamp + duration;

    if (this._isFade) {
      for (i = 0; i < 3; i++) {
        this._startColor[i] = this._endColor[i];
      }

      this._isFade = false;
    }

    return this;
  }

  /**
   * Returns whether the slice contains the given timestamp.
   */
  containsTime(time) {
    return time >= this.timestamp && time <= this.endTime;
  }

  /**
   * Returns an exact copy of this state object.
   */
  copy() {
    const result = new ExecutorState();

    result.timestamp = this.timestamp;
    result.duration = this.duration;
    result.endTime = this.endTime;

    result._startColor = [...this._startColor];
    result._endColor = [...this._endColor];
    result._isFade = this._isFade;

    return result;
  }

  /**
   * Returns the color at the given timestamp according to this state object.
   * The timestamp is assumed to be within the time range spanned by the
   * state object.
   */
  evaluateColorAt(timestamp, color) {
    let i;

    if (this._isFade) {
      const ratio =
        this.duration > 0 ? (timestamp - this.timestamp) / this.duration : 0;
      for (i = 0; i < 3; i++) {
        color[i] =
          (1 - ratio) * this._startColor[i] + ratio * this._endColor[i];
      }
    } else {
      for (i = 0; i < 3; i++) {
        color[i] = this._startColor[i];
      }
    }

    return color;
  }

  /**
   * Sets the state object to represent a fade from the current color to the
   * given color during a given duration.
   *
   * Returns the state object for easy chainability.
   */
  fadeToColor(color, duration) {
    let i;

    this.advanceTimeBy(duration);

    for (i = 0; i < 3; i++) {
      this._endColor[i] = color[i];
    }

    this._isFade = true;

    return this;
  }

  /**
   * Sets the state object to represent a fade from the current color to the
   * given gray color during a given duration.
   *
   * Returns the state object for easy chainability.
   */
  fadeToGray(grayLevel, duration) {
    let i;

    this.advanceTimeBy(duration);

    for (i = 0; i < 3; i++) {
      this._endColor[i] = grayLevel;
    }

    this._isFade = true;

    return this;
  }

  /**
   * Scales the components of the colors in this slice uniformly with the
   * given multiplier.
   */
  scaleColorsBy(factor) {
    for (let i = 0; i < 3; i++) {
      this._startColor[i] *= factor;
      this._endColor[i] *= factor;
    }
  }

  /**
   * Sets the state object to represent a constant color segment with the
   * given color during a given duration.
   *
   * Returns the state object for easy chainability.
   */
  setToConstantColor(color, duration) {
    let i;

    this.advanceTimeBy(duration);

    for (i = 0; i < 3; i++) {
      this._startColor[i] = color[i];
    }

    return this;
  }

  /**
   * Sets the state object to represent a constant gray segment with the
   * given color during a given duration.
   *
   * Returns the state object for easy chainability.
   */
  setToConstantGray(grayLevel, duration) {
    let i;

    this.advanceTimeBy(duration);

    for (i = 0; i < 3; i++) {
      this._startColor[i] = grayLevel;
    }

    return this;
  }
}

/**
 * Generator function that executes commands from the given light program
 * (provided as a base64-encoded string, an ArrayBuffer or an Uint8Array)
 * and yields the state object for every relevant timestamp.
 */
function createLightProgramExecutor(program, initialState = undefined) {
  const bytes = convertLightProgramToUint8Array(program);
  const numBytes = bytes.length;
  const loops = [];
  let index;
  let state;

  function reset() {
    index = 0;
    loops.length = 0;
    state = initialState ? initialState.copy() : new ExecutorState();
  }

  function getNextByte() {
    const byte = bytes[index];
    index++;
    return byte;
  }

  function getNextVaruint() {
    let value = 0;
    let shift = 0;
    let byte = 255;

    while (byte >= 128) {
      byte = bytes[index++];
      if (byte === undefined) {
        throw new Error('Bytecode ended while reading varuint');
      }

      value |= (byte & 0x7f) << shift;
      shift += 7;
    }

    return value;
  }

  function parseCommandCode() {
    return getNextByte() || 0 /* end */;
  }

  function parseColorInto(color) {
    color[0] = getNextByte() || 0;
    color[1] = getNextByte() || 0;
    color[2] = getNextByte() || 0;
  }

  function parseDuration() {
    // Durations are in frames @ 50fps, we need milliseconds
    return getNextVaruint() * 20;
  }

  const parseTimestamp = parseDuration;

  // eslint-disable-next-line complexity
  function* execute() {
    const color = [0, 0, 0];
    let duration;
    let grayLevel;
    let iterations;
    let loopItem;
    let newTimestamp;

    if (numBytes === 0) {
      return;
    }

    while (true) {
      const command = parseCommandCode();

      if (command === 0 /* end */) {
        break;
      }

      duration = 0;

      switch (command) {
        case 1 /* nop */:
          break;

        case 2 /* sleep */:
          duration = parseDuration();
          if (duration > 0) {
            state.advanceTimeBy(duration);
          }

          break;

        case 3 /* wait until */:
          newTimestamp = Math.max(state.timestamp, parseTimestamp());
          duration = newTimestamp - state.timestamp;
          if (duration > 0) {
            state.advanceTimeBy(duration);
          }

          break;

        case 4 /* set color */:
          parseColorInto(color);
          duration = parseDuration();
          state.setToConstantColor(color, duration);
          break;

        case 5 /* set gray */:
          grayLevel = getNextByte() || 0;
          duration = parseDuration();
          state.setToConstantGray(grayLevel, duration);
          break;

        case 6 /* set black */:
          duration = parseDuration();
          state.setToConstantGray(0, duration);
          break;

        case 7 /* set white */:
          duration = parseDuration();
          state.setToConstantGray(255, duration);
          break;

        case 8 /* fade to color */:
          parseColorInto(color);
          duration = parseDuration();
          state.fadeToColor(color, duration);
          break;

        case 9 /* fade to gray */:
          grayLevel = getNextByte() || 0;
          duration = parseDuration();
          state.fadeToGray(grayLevel, duration);
          break;

        case 10 /* fade to black */:
          duration = parseDuration();
          state.fadeToGray(0, duration);
          break;

        case 11 /* fade to white */:
          duration = parseDuration();
          state.fadeToGray(255, duration);
          break;

        case 12 /* loop begin */:
          iterations = getNextByte();
          loops.push([
            index,
            iterations > 0 ? iterations : Number.POSITIVE_INFINITY
          ]);
          break;

        case 13 /* loop end */:
          loopItem = loops[loops.length - 1];
          if (!loopItem) {
            throw new Error('Found end loop command when loop stack is empty');
          }

          loopItem[1]--;
          if (loopItem[1]) {
            index = loopItem[0];
          } else {
            loops.pop();
          }

          break;

        case 20 /* set pyro */:
        case 21 /* set pyro all */:
          // just reaed the next byte that belongs to the channel, but don't
          // do anything with it
          getNextByte();
          break;

        default:
          throw new Error(
            'Unknown command in light program: ' + String(command)
          );
      }

      if (duration > 0) {
        yield state;
      }
    }
  }

  reset();

  return {
    execute,
    reset
  };
}

/**
 * Factory function that creates a new light program player object with a
 * single `evaluateColorAt()` function that evaluates the color at a given
 * timestamp, specified in seconds.
 */
function createLightProgramPlayer(program) {
  const executor = createLightProgramExecutor(program);
  const slices = new Deque();
  const maxHistoryLength = 31;
  let lastSliceEndTime;
  let endReached;
  let sliceGenerator;

  function storeNextSliceFromExecutor() {
    let slice;

    if (sliceGenerator) {
      const { value, done } = sliceGenerator.next();

      if (done) {
        // No more slices
        slice = slices
          .peekBack()
          .copy()
          .advanceTimeBy(Number.POSITIVE_INFINITY);
        sliceGenerator = null;
      } else {
        slice = value.copy();

        // Convert durations to seconds as the executor works with milliseconds
        // internally
        slice.timestamp /= 1000;
        slice.duration /= 1000;

        // Also scale colors down to the 0-1 range
        slice.scaleColorsBy(1 / 255);
      }

      if (slices.push(slice) > maxHistoryLength) {
        slices.shift();
      }

      lastSliceEndTime = slice.timestamp + slice.duration;
    }

    return !endReached;
  }

  /**
   * Returns the color of the light program at the given timestamp.
   *
   * The result is provided in an output argument to avoid allocations.
   *
   * @param  {number}   seconds  the timestamp
   * @param  {number[]} color    the result will be returned here
   */
  function evaluateColorAt(seconds, color) {
    let index;
    let slice;

    if (!Number.isFinite(seconds)) {
      throw new TypeError('infinite timestamps not supported');
    }

    // Do we need to rewind?
    const front = slices.peekFront();
    if (front && seconds < front.timestamp) {
      rewind();
    }

    // Fast-forward to the given timestamp and feed the event queue
    while (seconds >= lastSliceEndTime) {
      storeNextSliceFromExecutor();
    }

    // Optimize for the common case: the timestamp is almost always somewhere
    // in the last slice of event queue, so scan from the back
    index = slices.length - 1;
    while (index > 0) {
      slice = slices.peekAt(index);
      if (slice.containsTime(seconds)) {
        break;
      }

      index--;
    }

    return slice.evaluateColorAt(seconds, color);
  }

  /**
   * Iterator that evaluates the light program with the given number of frames
   * per second, yielding timestamp-color pairs.
   *
   * @param {number} fps  the number of frames (evaluations) per second
   */
  function* iterate(fps = 25) {
    const dt = 1 / fps;
    const color = [0, 0, 0];
    let [seconds, frames, t] = [0, 0, 0];

    // eslint-disable-next-line no-unmodified-loop-condition
    while (sliceGenerator) {
      evaluateColorAt(t, color);
      yield [t, color];
      t += dt;
      frames += 1;
      if (frames === fps) {
        seconds++;
        frames = 0;
        t = seconds;
      }
    }
  }

  /**
   * Rewinds the player to zero time.
   */
  function rewind() {
    slices.clear();
    slices.push(new ExecutorState());

    executor.reset();
    sliceGenerator = executor.execute();

    lastSliceEndTime = -1;
    endReached = false;
  }

  rewind();

  return {
    evaluateColorAt,
    iterate
  };
}

function test() {
  const data =
    'BRoGBIAAAAUJGi0C8QMLmwQIAP8AjwwCoxEKhQgCMgcDCP//AAMCGwcECP//AAMCGwcDCP//AAQCGwcDCP//AAMCGwcECP//AAMMAgIbBwMI//8ABA0CGwcDCNXVCwME/4AAAAj/jQAbBwQI/5AAAwj/nQAbBwMI/6AABAj/rAAbBwMI/7AAAwj/vAAbBwQI/8AAAwj/zAAbBwMI/9AABAj/3AAbBwMI/98ABAj/7AAaBwQI/+8AAwj//AAbBwQI1dULAgj//wABCP/yABsHAwj/7wAECP/iABsHAwj/3wADCP/SABsHBAj/zwADCP/CABsHAwj/vwAECP+yABsHAwj/rwADCP+iABsHBAj/nwADCP+SABsHBAj/jwADCP+CABsHAwjVcAsDCP9/AAEI/3IAGwcDCP9vAAMI/2IAGwcECP9fAAMI/1MAGwcDCP9PAAQI/0MAGwcDCP8/AAMI/zMAGwcECP8vAAMI/yMAGwcDCP8gAAQI/xMAGwcDCP8QAAQI/wMAGwcDCNULCwME/wAAGwgAgIC3CBS/AhkVAAL1AQQA//8ZBACAgPQBBAD//xkEAICAgwQJGrYIAA==';
  const player = createLightProgramPlayer(data);

  for (const state of player.iterate()) {
    console.log(state[0], state[1]);
  }
}

test();
