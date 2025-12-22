/**
 * A-Frame component to keep track of the state of modifier keys.
 */
import AFrame, { type System } from 'aframe';

export type ModifierKeysSystem = System & {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  _handleKeyEvent(event: KeyboardEvent): void;
  updateSyntheticEvent(event: any): void;
};

AFrame.registerSystem('modifier-keys', {
  init(this: ModifierKeysSystem) {
    this.altKey = false;
    this.ctrlKey = false;
    this.metaKey = false;
    this.shiftKey = false;

    const handleKeyEvent = this._handleKeyEvent.bind(this);

    window.addEventListener('keydown', handleKeyEvent);
    window.addEventListener('keyup', handleKeyEvent);
  },

  _handleKeyEvent(this: ModifierKeysSystem, event: KeyboardEvent) {
    this.altKey = event.altKey;
    this.ctrlKey = event.ctrlKey;
    this.metaKey = event.metaKey;
    this.shiftKey = event.shiftKey;
  },

  updateSyntheticEvent(this: ModifierKeysSystem, event: any) {
    event.altKey = this.altKey;
    event.ctrlKey = this.ctrlKey;
    event.metaKey = this.metaKey;
    event.shiftKey = this.shiftKey;
  },
});
