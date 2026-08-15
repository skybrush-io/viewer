/**
 * Information about updates available for the application.
 */
export type UpdateInfo = {
  /** Whether an update is available. */
  available: boolean;
  /** Whether the update has been downloaded. */
  downloaded: boolean;
  /** The version of the available update, or null if no update is available. */
  version: string | null;
};
