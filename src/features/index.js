import { combineReducers } from 'redux';

import audioReducer from './audio/slice';
import playbackReducer from './playback/slice';
import settingsReducer from './settings/slice';
import showReducer from './show/slice';
import sidebarReducer from './sidebar/slice';
import threeDReducer from './three-d/slice';

export default combineReducers({
  audio: audioReducer,
  playback: playbackReducer,
  settings: settingsReducer,
  show: showReducer,
  sidebar: sidebarReducer,
  threeD: threeDReducer
});
