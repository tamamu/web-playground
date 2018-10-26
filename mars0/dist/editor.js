


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

function renderTiles(ctx, tiles, tm, selectedLayer) {
  for (let h=0; h < tiles.length; ++h) {
    ctx.globalAlpha = h == selectedLayer ? 1 : 0.3
    for (let j=0; j < tiles[h].length; ++j) {
      for (let k=0; k < tiles[h][j].length; ++k) {
        if (tiles[h][j][k] >= 0) {
          tm.render(ctx, tiles[h][j][k], k*24, j*24, 24, 24)
        }
      }
    }
  }
}

class MouseManager {
  construcrtor() {
    this.clicked = false
    this.x = 0
    this.y = 0
    this.shift = false
  }
  onMouseMove(e) {
    this.x = e.layerX
    this.y = e.layerY
    this.shift = e.shiftKey
  }
  onMouseDown(e) {
    this.clicked = true
    this.shift = e.shiftKey
  }
  onMouseUp(e) {
    this.clicked = false
    this.shift = e.shiftKey
  }
  onMouseClick(e) {
    this.clicked = true
    this.x = e.layerX
    this.y = e.layerY
    this.shift = e.shiftKey
  }
  setEvent(target) {
    target.onmousemove = this.onMouseMove.bind(this)
  }
}

class Main {
  constructor(canvas, base, tileCursor, changer) {
    this.tiles = new Array(2)
    for (let h=0; h < 2; ++h) {
      this.tiles[h] = new Array(20)
      for (let y=0; y < 20; ++y) {
        if (h==0) {
          this.tiles[h][y] = new Array(30).fill(129)
        } else {
          this.tiles[h][y] = new Array(30).fill(-1)
        }
      }
    }
    this.tm = new TileManager("./resources/base.png", 16, 16)
    this.canvas = canvas
    this.base = base
    this.tileCursor = tileCursor
    this.ctx = this.canvas.getContext('2d')
    this.tilesMouse = new MouseManager()
    this.baseMouse = new MouseManager()
    this.selectedTile = 0
    this.selectedLayer = 0
    this.changer = changer
    this.changer.onclick = (e) => {
      this.selectedLayer = this.selectedLayer == 0 ? 1 : 0
    }
    canvas.onmousemove = this.tilesMouse.onMouseMove.bind(this.tilesMouse)
    canvas.onmousedown = this.tilesMouse.onMouseDown.bind(this.tilesMouse)
    canvas.onmouseup = this.tilesMouse.onMouseUp.bind(this.tilesMouse)
    base.onclick = this.updateSelectedTile.bind(this)
    //this.tilesMouse.setEvent(window)
    this.mx = 0
    this.my = 0
    document.onkeydown = this.showTilesArray.bind(this)
  }
  showTilesArray() {
    let s = '['
    for (let h of this.tiles) {
      s+='['
      for (let row of h) {
        s+='['
        for (let t of row) {
          s+=t+','
        }
        s+='],'
      }
      s+='],'
    }
    s+=']'
    console.log(s)
  }
  updateSelectedTile(e) {
    console.log(e)
    let x = Math.floor(e.offsetX / 16)
    let y = Math.floor(e.offsetY / 16)
    this.selectedTile = x + y * 8
    console.log(this.selectedTile)
  }
  update() {
    if (this.tilesMouse.x > 0 && this.tilesMouse.x < 32*30 && this.tilesMouse.y > 0 && this.tilesMouse.y < 24*20) {
      this.mx = Math.floor(this.tilesMouse.x / 24)
      this.my = Math.floor(this.tilesMouse.y / 24)
      if (this.tilesMouse.clicked) {
        this.tiles[this.selectedLayer][this.my][this.mx] = this.tilesMouse.shift ? -1 : this.selectedTile
      }
    }
  }
  render() {
    this.selX = this.selectedTile % 8
    this.selY = (this.selectedTile - this.selX) / 8
    this.tileCursor.style.transform = `translateX(${16*this.selX}px) translateY(${16*this.selY}px)`
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, 24*30, 24*20)
    renderTiles(this.ctx, this.tiles, this.tm, this.selectedLayer)
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
  let base = document.getElementById('base')
  let tileCursor = document.getElementById('cursor')
  let changer = document.getElementById('changer')
  canvas.width = 24*30;
  canvas.height = 24*20;
  let main = new Main(canvas, base, tileCursor, changer)
  requestAnimationFrame(main.mainLoop.bind(main))
}
