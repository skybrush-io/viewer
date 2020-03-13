import { combineReducers } from 'redux';

import audioReducer from './audio/slice';
import playbackReducer from './playback/slice';
import showReducer from './show/slice';
import threeDReducer from './three-d/slice';

export default combineReducers({
  audio: audioReducer,
  playback: playbackReducer,
  show: showReducer,
  threeD: threeDReducer
});
