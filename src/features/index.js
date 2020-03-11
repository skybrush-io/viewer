import { combineReducers } from 'redux';

import playbackReducer from './playback/slice';
import threeDReducer from './three-d/slice';

export default combineReducers({
  playback: playbackReducer,
  threeD: threeDReducer
});
