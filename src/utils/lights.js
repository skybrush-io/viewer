/**
 * Class that takes a light program in base64-encoded string or in raw uint8
 * array format as its first argument and that can return the color in the
 * light program at any given time instant.
 */
class LightProgramPlayer {
  constructor(program) {}

  /**
   * Returns the color in the light program at the given time instant.
   *
   * @param {number}       time    the time instant, measured in seconds
   * @param {THREE.Color}  result  the color object where the result will be
   *        provided
   */
  getColorAt(time, result) {
    const t = Math.sin(time / 10) / 2 + 0.5;
    result.setRGB(0, t * 0.5, t);
  }
}

/**
 * Factory function that creates a new light program player object with a
 * single `getColorAt()` function that evaluates the color at a given
 * timestamp.
 */
export default function createLightProgramPlayer(program) {
  const player = new LightProgramPlayer(program);

  return {
    getColorAt: player.getColorAt.bind(player)
  };
}
