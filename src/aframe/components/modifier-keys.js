/**
 * A-Frame component to keep track of the state of modifier keys.
 */
import AFrame from '@skybrush/aframe-components';

AFrame.registerSystem('modifier-keys', {
  init() {
    this.altKey = false;
    this.ctrlKey = false;
    this.metaKey = false;
    this.shiftKey = false;

    const handleKeyEvent = this._handleKeyEvent.bind(this);

    window.addEventListener('keydown', handleKeyEvent);
    window.addEventListener('keyup', handleKeyEvent);
  },

  _handleKeyEvent(event) {
    this.altKey = event.altKey;
    this.ctrlKey = event.ctrlKey;
    this.metaKey = event.metaKey;
    this.shiftKey = event.shiftKey;
  },

  updateSyntheticEvent(event) {
    event.altKey = this.altKey;
    event.ctrlKey = this.ctrlKey;
    event.metaKey = this.metaKey;
    event.shiftKey = this.shiftKey;
  },
});
