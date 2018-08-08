import * as Text from '../constants/Text';

const initialState = {
  chars: [],
  renderedIndex: 0,
  show: true
};

export default function text(state = initialState, action) {
  switch (action.type) {
    case Text.CHANGE_TEXT:
      return {
        ...state,
        chars: action.chars,
        renderedIndex: 0
      };
    case Text.FORWARD:
      let idx = state.renderedIndex;
      if (idx < state.chars.length) {
        idx += 1;
      }
      return {
        ...state,
        renderedIndex: idx
      };
    case Text.SHOW_TEXT:
      return {
        ...state,
        show: true
      };
    case Text.HIDE_TEXT:
      return {
        ...state,
        show: false
      };
    default:
      return state;
  }
}
