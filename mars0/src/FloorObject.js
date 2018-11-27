
import GameObject from './GameObject'

export class FloorProperty {
  constructor(name, type) {
    this.name = name
    this.objType = type
  }
}

export class FloorObject extends GameObject {
  constructor(stat, renderable, x, y, tileId) {
    super(renderable, x, y, tileId)
    this.stat = stat
  }
}
