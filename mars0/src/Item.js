
import GameObject from './GameObject'

export class ItemState {
  constructor(name) {
    this.name = name
    this.type = 'none'
    this.isSoiled = false
  }
  get screenName() {
    let n = this.name
    if (this.isSoiled) {
      n = '土を被った' + n
    }
    return n
  }
}

export class Item extends GameObject {
  constructor(stat, renderable, x, y, tileId) {
    super(renderable, x, y, tileId)
    this.stat = stat
  }
}
