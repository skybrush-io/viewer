export const isSupportedFrameRate = (fps: number): boolean => {
  return Number.isFinite(fps) && fps >= 1 && fps <= 1000;
};
