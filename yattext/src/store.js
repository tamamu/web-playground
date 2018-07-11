import { compose, createStore } from 'redux';
import rootReducer from './rootReducer';

export default function createFinalState() {
  const finalCreateStore = compose()(createStore);
  return finalCreateStore(rootReducer);
}
