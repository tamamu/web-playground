
import {TILESIZE} from './constants'

export default class GameObject {
  constructor(renderable, x, y, tileId) {
    this.renderable = renderable
    this._x = x
    this._y = y
    this._tileId = tileId
    this._direction = 'down'
  }
  get x() {
    return this._x
  }
  get y() {
    return this._y
  }
  get tileId() {
    return this._tileId
  }
  get direction() {
    return this._direction
  }
  set x(value) {
    this._x = value
    //this.renderable.prop.x = value * 32
  }
  set y(value) {
    this._y = value
    //this.renderable.prop.y = value * 32
  }
  set direction(value) {
    this._direction = value
    switch (this._direction) {
      case 'down':
        this._tileId = this.renderable.prop.tileId = 1
        break
      case 'down-left':
        this._tileId = this.renderable.prop.tileId = 4
        break
      case 'left':
        this._tileId = this.renderable.prop.tileId = 7
        break
      case 'down-right':
        this._tileId = this.renderable.prop.tileId = 10
        break
      case 'right':
        this._tileId = this.renderable.prop.tileId = 13
        break
      case 'up-left':
        this._tileId = this.renderable.prop.tileId = 16
        break
      case 'up':
        this._tileId = this.renderable.prop.tileId = 19
        break
      case 'up-right':
        this._tileId = this.renderable.prop.tileId = 22
        break
    }
  }
  set tileId(value) {
    this._tileId = value
    this.renderable.prop.tileId = value
  }
  move(x, y) {
    this._x = x
    this._y = y
    this.renderable.prop.x = this._x * TILESIZE
    this.renderable.prop.y = this._y * TILESIZE
  }
  fix() {
    this.renderable.prop.x = this.x * TILESIZE
    this.renderable.prop.y = this.y * TILESIZE
    this.renderable.prop.tileId = this.tileId
  }
}
