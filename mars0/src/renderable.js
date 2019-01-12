
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

export class Renderable {
  constructor(x, y, tiles, tileId) {
    this.prop = new RenderableProperty(x, y, tileId)
    this.tiles = tiles
  }
  static copy(renderable) {
    return new Renderable(renderable.prop.x, renderable.prop.y, renderable.tiles, renderable.prop.tileId)
  }
}


