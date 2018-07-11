import * as Text from '../constants/Text';

const initialState = {
  text: '',
  renderedIndex: 0,
  show: false
};

export default function text(state = initialState, action) {
  switch (action.type) {
    case Text.CHANGE_TEXT:
      return Object.assign({}, state, {
        text: action.text,
        renderedIndex: 0
      });
    case Text.FORWARD:
      let idx = state.renderedIndex;
      if (idx < state.text.length) {
        idx += 1;
      }
      return Object.assign({}, state, {
        renderedIndex: idx
      });
    case Text.SHOW_TEXT:
      return Object.assign({}, state, {
        show: true
      });
    case Text.HIDE_TEXT:
      return Object.assign({}, state, {
        show: false
      });
    default:
      return state;
  }
}
