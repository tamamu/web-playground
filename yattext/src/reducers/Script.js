import * as Script from '../constants/Script';

const initialState = {
  forwarding: false
}

export default function script(state = initialState, action) {
  switch (action.type) {
    case Script.CLICK:
      return {
        ...state,
        forwarding: true,
      };
    case Script.STOP:
      return {
        ...state,
        forwarding: false,
      };
    default:
      return state;
  }
}
