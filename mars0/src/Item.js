
import GameObject from './GameObject'

export class ItemState {
  constructor(name) {
    this.name = name
    this.type = 'none'
  }
}

export class Item extends GameObject {
  constructor(stat, renderable, x, y, tileId) {
    super(renderable, x, y, tileId)
    this.stat = stat
  }
}
