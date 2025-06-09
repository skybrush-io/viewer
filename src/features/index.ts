import { combineReducers } from 'redux';

import audioReducer from './audio/slice';
import hotkeysReducer from './hotkeys/slice';
import playbackReducer from './playback/slice';
import settingsReducer from './settings/slice';
import showReducer from './show/slice';
import sidebarReducer from './sidebar/slice';
import threeDReducer from './three-d/slice';
import uiReducer from './ui/slice';
import validationReducer from './validation/slice';

export default combineReducers({
  audio: audioReducer,
  hotkeys: hotkeysReducer,
  playback: playbackReducer,
  settings: settingsReducer,
  show: showReducer,
  sidebar: sidebarReducer,
  threeD: threeDReducer,
  ui: uiReducer,
  validation: validationReducer,
});
