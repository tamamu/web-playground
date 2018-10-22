
export default class Camera {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.isFixed = false
    this.fixedX = x
    this.fixedY = y
  }
  getPosition() {
    if (this.isFixed) {
      return {x: this.fixedX, y: this.fixedY}
    } else {
      return {x: this.x, y: this.y}
    }
  }
  fix() {
    this.isFixed = true
    this.fixedX = this.x
    this.fixedY = this.y
  }
  unfix() {
    this.isFixed = false
  }
}

