import { combineReducers } from 'redux';

import audioReducer from './audio/slice';
import chartReducer from './charts/slice';
import hotkeysReducer from './hotkeys/slice';
import playbackReducer from './playback/slice';
import selectionReducer from './selection/slice';
import settingsReducer from './settings/slice';
import showReducer from './show/slice';
import sidebarReducer from './sidebar/slice';
import threeDReducer from './three-d/slice';
import uiReducer from './ui/slice';
import validationReducer from './validation/slice';

export default combineReducers({
  audio: audioReducer,
  charts: chartReducer,
  hotkeys: hotkeysReducer,
  playback: playbackReducer,
  selection: selectionReducer,
  settings: settingsReducer,
  show: showReducer,
  sidebar: sidebarReducer,
  threeD: threeDReducer,
  ui: uiReducer,
  validation: validationReducer,
});
