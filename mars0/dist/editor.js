


class TileManager {
  constructor(path, width, height) {
    this.base = new Image();
    this.base.src = path;
    this.width = width
    this.height = height
    this.base.onload = () => {
      this.numx = this.base.width / this.width
      this.numy = this.base.height / this.height
    }
  }
  render(ctx, id, x, y, width, height) {
    const ix = id % this.numx
    const iy = (id - ix) / this.numx
    ctx.drawImage(this.base, ix*this.width, iy*this.height, this.width, this.height, x, y, width, height)
  }
}

function renderTiles(ctx, tiles, tm) {
  for (let j=0; j < tiles.length; ++j) {
    for (let k=0; k < tiles[j].length; ++k) {
      tm.render(ctx, tiles[j][k], k*24, j*24, 24, 24)
    }
  }
}

class MouseManager {
  construcrtor() {
    this.clicked = false
    this.x = 0
    this.y = 0
  }
  onMouseMove(e) {
    this.x = e.clientX
    this.y = e.clientY
  }
  onMouseDown(e) {
    this.clicked = true
  }
  onMouseUp(e) {
    this.clicked = false
  }
  setEvent(target) {
    target.onmousemove = this.onMouseMove.bind(this)
    target.onmousedown = this.onMouseDown.bind(this)
    target.onmouseup = this.onMouseUp.bind(this)
  }
}

class Main {
  constructor(canvas, tools, tileCursor) {
    this.tiles = new Array(20)
    for (let y=0; y < 20; ++y) {
      this.tiles[y] = new Array(30).fill(0)
    }
    this.tm = new TileManager("./resources/base.png", 16, 16)
    this.canvas = canvas
    this.tools = tools
    this.tileCursor = tileCursor
    this.ctx = this.canvas.getContext('2d')
    this.tilesMouse = new MouseManager()
    this.tilesMouse.setEvent(window)
    this.selectedTile = 0
    this.mx = 0
    this.my = 0
  }
  update() {
    if (this.tilesMouse.x < 24*30) {
      this.mx = Math.floor(this.tilesMouse.x / 24)
      this.my = Math.floor(this.tilesMouse.y / 24)
      if (this.tilesMouse.clicked) this.tiles[this.my][this.mx] = this.selectedTile
    } else if (this.tilesMouse.clicked){
      this.selectedTile = Math.floor((this.tilesMouse.x-24*30) / 16) + Math.floor(this.tilesMouse.y / 16) * 8
    }
  }
  render() {
    this.selX = this.selectedTile % 8
    this.selY = (this.selectedTile - this.selX) / 8
    this.tileCursor.style.transform = `translateX(${16*this.selX}px) translateY(${16*this.selY}px)`
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, 24*30, 24*20)
    renderTiles(this.ctx, this.tiles, this.tm)
    this.ctx.fillStyle = 'red'
    this.ctx.fillRect(this.mx * 24, this.my * 24, 24, 24)
  }
  mainLoop() {
    this.update()
    this.render()
    requestAnimationFrame(this.mainLoop.bind(this))
  }
}

window.onload = () => {
  let canvas = document.getElementById('tiles')
  let tools = document.getElementById('tools')
  let tileCursor = document.getElementById('cursor')
  canvas.width = 24*30;
  canvas.height = 24*20;
  let main = new Main(canvas, tools, tileCursor)
  requestAnimationFrame(main.mainLoop.bind(main))
}
