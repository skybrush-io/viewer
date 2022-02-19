export enum UIMode {
  PLAYER = 'player',
  VALIDATION = 'validation',
}

/**
 * Array containing the allowed UI mode constants, also defining a natural
 * ordering among UI modes.
 */
export const MODES: UIMode[] = [UIMode.PLAYER, UIMode.VALIDATION];
