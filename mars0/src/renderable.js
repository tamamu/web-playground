
export class Renderable {
  constructor(x, y, tiles, tileId) {
    this.prop = new RenderableProperty(x, y, tileId)
    this.tiles = tiles
  }
}

export class RenderableProperty {
  constructor(x, y, tileId) {
    this.x = x
    this.y = y
    this.tileId = tileId
  }
  /*
  set x(value) {
    this.x = value
  }
  set y(value) {
    this.y = value
  }
  set tileId(value) {
    this.tileId = value
  }
  */
}

