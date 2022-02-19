/**
 * Formats a timestamp expressed in seconds in a way that is suitable as a
 * "playback timestamp" in the playback slider.
 */
export function formatPlaybackTimestamp(
  seconds: number,
  { digits = 0 }: { digits?: number } = {}
): string {
  if (!Number.isFinite(seconds)) {
    return '--:--';
  }

  if (seconds < 0) {
    return `-${formatPlaybackTimestamp(-seconds)}`;
  }

  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  const formattedSeconds =
    digits === 0 ? String(Math.floor(seconds)) : seconds.toFixed(digits);
  return `${minutes}:${
    seconds < 10 ? `0${formattedSeconds}` : formattedSeconds
  }`;
}
