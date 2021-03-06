import * as Text from '../constants/Text';

export function change(chars) {
  return {
    type: Text.CHANGE_TEXT,
    chars
  };
}

export function forward() {
  return {
    type: Text.FORWARD
  }
}

export function show() {
  return {
    type: Text.SHOW_TEXT
  };
}

export function hide() {
  return {
    type: Text.HIDE_TEXT
  }
}

export function push(chars) {
  return {
    type: Text.PUSH_TEXT,
    chars
  }
}

export function clear() {
  return {
    type: Text.CLEAR,
  }
}
