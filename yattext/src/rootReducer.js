import { combineReducers } from 'redux';
import text from './reducers/Text';
import script from './reducers/Script';

const rootReducer = combineReducers({
  script,
  text,
});

export default rootReducer;
