
import {Animatable, AnimationState} from './animation'
import {TILESIZE} from './constants'

export function createWalkAnimatable(tm, x, y, tileId) {
  return new Animatable(x, y, tm, tileId, {
    "right-attack": [
      new AnimationState(TILESIZE, 0, 13, 96),
      new AnimationState(-TILESIZE, 0, 13, 96),
    ],
    "right": [
      new AnimationState(TILESIZE/4, 0, 12, 48),
      new AnimationState(TILESIZE/4, 0, 13, 48),
      new AnimationState(TILESIZE/4, 0, 14, 48),
      new AnimationState(TILESIZE/4, 0, 13, 48),
    ],
    "left-attack": [
      new AnimationState(-TILESIZE, 0, 7, 96),
      new AnimationState(TILESIZE, 0, 7, 96),
    ],
    "left": [
      new AnimationState(-TILESIZE/4, 0, 6, 48),
      new AnimationState(-TILESIZE/4, 0, 7, 48),
      new AnimationState(-TILESIZE/4, 0, 8, 48),
      new AnimationState(-TILESIZE/4, 0, 7, 48),
    ],
    "up-attack": [
      new AnimationState(0, -TILESIZE, 19, 96),
      new AnimationState(0, TILESIZE, 19, 96),
    ],
    "up": [
      new AnimationState(0, -TILESIZE/4, 18, 48),
      new AnimationState(0, -TILESIZE/4, 19, 48),
      new AnimationState(0, -TILESIZE/4, 20, 48),
      new AnimationState(0, -TILESIZE/4, 19, 48),
    ],
    "down-attack": [
      new AnimationState(0, TILESIZE, 1, 96),
      new AnimationState(0, -TILESIZE, 1, 96),
    ],
    "down": [
      new AnimationState(0, TILESIZE/4, 0, 48),
      new AnimationState(0, TILESIZE/4, 1, 48),
      new AnimationState(0, TILESIZE/4, 2, 48),
      new AnimationState(0, TILESIZE/4, 1, 48),
    ],
    "down-right-attack": [
      new AnimationState(TILESIZE, TILESIZE, 10, 96),
      new AnimationState(-TILESIZE, -TILESIZE, 10, 96),
    ],
    "down-right": [
      new AnimationState(TILESIZE/4, TILESIZE/4, 9, 48),
      new AnimationState(TILESIZE/4, TILESIZE/4, 10, 48),
      new AnimationState(TILESIZE/4, TILESIZE/4, 11, 48),
      new AnimationState(TILESIZE/4, TILESIZE/4, 10, 48),
    ],
    "down-left-attack": [
      new AnimationState(-TILESIZE, TILESIZE, 4, 96),
      new AnimationState(TILESIZE, -TILESIZE, 4, 96),
    ],
    "down-left": [
      new AnimationState(-TILESIZE/4, TILESIZE/4, 3, 48),
      new AnimationState(-TILESIZE/4, TILESIZE/4, 4, 48),
      new AnimationState(-TILESIZE/4, TILESIZE/4, 5, 48),
      new AnimationState(-TILESIZE/4, TILESIZE/4, 4, 48),
    ],
    "up-right-attack": [
      new AnimationState(TILESIZE, -TILESIZE, 22, 96),
      new AnimationState(-TILESIZE, TILESIZE, 22, 96),
    ],
    "up-right": [
      new AnimationState(TILESIZE/4, -TILESIZE/4, 21, 48),
      new AnimationState(TILESIZE/4, -TILESIZE/4, 22, 48),
      new AnimationState(TILESIZE/4, -TILESIZE/4, 23, 48),
      new AnimationState(TILESIZE/4, -TILESIZE/4, 22, 48),
    ],
    "up-left-attack": [
      new AnimationState(-TILESIZE, -TILESIZE, 16, 96),
      new AnimationState(TILESIZE, TILESIZE, 16, 96),
    ],
    "up-left": [
      new AnimationState(-TILESIZE/4, -TILESIZE/4, 15, 48),
      new AnimationState(-TILESIZE/4, -TILESIZE/4, 16, 48),
      new AnimationState(-TILESIZE/4, -TILESIZE/4, 17, 48),
      new AnimationState(-TILESIZE/4, -TILESIZE/4, 16, 48),
    ],
  })
}

