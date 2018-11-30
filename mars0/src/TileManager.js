
export default class TileManager {
  constructor(path, width, height, div=false) {
    this.base = new Image();
    this.base.src = path;
    this.width = width
    this.height = height
    this.base.onload = () => {
      if (div) {
        this.numx = width
        this.numy = height
        this.width = this.base.width / this.numx
        this.height = this.base.height / this.numy
      } else {
        this.numx = this.base.width / this.width
        this.numy = this.base.height / this.height
      }
      console.log(path, this.numx, this.numy, this.width, this.height)
    }
  }
  render(ctx, id, x, y, width, height) {
    const ix = id % this.numx
    const iy = (id - ix) / this.numx
    if (this.height > this.width) {
      const w = this.width * (height/this.height)
      const l = width/2 - w/2
      ctx.drawImage(this.base, ix*this.width, iy*this.height, this.width, this.height, x+l, y, w, height)
    } else {
      ctx.drawImage(this.base, ix*this.width, iy*this.height, this.width, this.height, x, y, width, height)
    }
  }
  copy(ctx, id, x, y, w, h, rx, ry, rw, rh) {
    const ix = id % this.numx
    const iy = (id - ix) / this.numx
    ctx.drawImage(this.base, ix*this.width+x, iy*this.height+y, w, h, rx, ry, rw, rh)
  }
}
