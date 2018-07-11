import { combineReducers } from 'redux';
import text from './reducers/Text';

const rootReducer = combineReducers({
  text,
});

export default rootReducer;
