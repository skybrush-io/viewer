import { combineReducers } from 'redux';

import playbackReducer from './playback/slice';
import showReducer from './show/slice';
import threeDReducer from './three-d/slice';

export default combineReducers({
  playback: playbackReducer,
  show: showReducer,
  threeD: threeDReducer
});
