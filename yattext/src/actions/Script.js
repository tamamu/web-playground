import * as Script from '../constants/Script';

export function click() {
  return {
    type: Script.CLICK,
  };
}

export function stop() {
  return {
    type: Script.STOP,
  };
}
