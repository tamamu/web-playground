
import {drawWindow} from './Window'
import {TILESIZE} from './constants'

export default class ProduceWindow {
  constructor(keystore, inventory) {
    this.keyStore = keystore
    this.recipes = []
    this.matchedRecipes = []
    this.usingItems = inventory.map(x => null)
    this.inventory = inventory
    this.selectedItems = inventory.map(x => false)
    this.selectContent = 1
    this.cursor = 0
    this.closed = false
  }
  input() {
    if (new Date() - this.keyStore.lastDown < 80) {
      return 1
    }
    this.keyStore.lastDown = new Date()
    const keys = this.keyStore.get()
    console.log(keys)
    if (keys['ArrowUp']) {
      this.selectContent = this.selectContent - 1
      if (this.selectContent < 0) {
        this.selectContent = 2
      }
    } else if (keys['ArrowDown']) {
      this.selectContent = this.selectContent + 1
      if (this.selectContent > 2) {
        this.selectContent = 0
      }
    }
    if (keys['ArrowLeft']) {
      this.cursor = this.cursor == 0 ? this.inventory.length-1 : this.cursor-1
    } else if (keys['ArrowRight']) {
      this.cursor = this.cursor == this.inventory.length-1 ? 0 : this.cursor+1
    }
    if (keys[' ']) {
      if (this.selectContent == 0) {
        const itemNum = this.usingItems[this.cursor]
        if (itemNum != null) {
          this.selectedItems[itemNum] = false
          this.usingItems[this.cursor] = null
        }
      } else if (this.selectContent == 1) {
        const item = this.inventory[this.cursor]
        if (item) {
          this.selectedItems[this.cursor] = !this.selectedItems[this.cursor]
          if (this.selectedItems[this.cursor]) {
            for (let j=0; j < this.usingItems.length; ++j) {
              if (this.usingItems[j] == null) {
                this.usingItems[j] = this.cursor
                break
              }
            }
          } else {
            this.usingItems = this.usingItems.map(x => x == this.cursor ? null : x)
          }
        }
      } else {
        console.log("enter")
      }
    }
    if (keys['Escape']) {
      this.closed = true
      return 0
    }
    return 1
  }
  *genLifeCycle() {
    while(true) {
      while(this.input() == 1) {
        yield 1
      }
      if (this.closed) {
        break
      }
    }
    return 0
  }
  render(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(0, 0, 800, 600)
    const w = TILESIZE*this.inventory.length
    ctx.fillStyle = 'white'
    ctx.font = "400 18px 'M PLUS Rounded 1c'"
    ctx.fillText('材料を選んでください', 310, 12)
    const y1 = 56
    const y2 = 312
    const y3 = 372
    const y4 = 428
    drawWindow(ctx, 250, y1, 300, 240)
    drawWindow(ctx, 400-w/2, y2, w, TILESIZE)
    drawWindow(ctx, 400-w/2, y3, w, TILESIZE)
    drawWindow(ctx, 368, y4, 62, 32)
    ctx.fillStyle = 'white'
    ctx.fillText("決定", 380, y4+4)
    for (let j=0; j < this.inventory.length; ++j) {
      const item = this.inventory[j]
      if (item) {
        if (this.selectedItems[j]) {
          ctx.fillStyle = 'white'
          ctx.fillRect(TILESIZE * j + 400-w/2, y3, TILESIZE, TILESIZE)
        }
        item.renderable.tiles.render(ctx, item.tileId, TILESIZE * j + 400-w/2, y3, TILESIZE, TILESIZE)
      }
    }
    for (let j=0; j < this.usingItems.length; ++j) {
      const itemNum = this.usingItems[j]
      if (itemNum != null) {
        const item = this.inventory[itemNum]
        item.renderable.tiles.render(ctx, item.tileId, TILESIZE * j + 400-w/2, y2, TILESIZE, TILESIZE)
      }
    }
    ctx.strokeStyle = 'blue'
    if (this.selectContent < 2) {
      const x = this.cursor * TILESIZE + 400-w/2
      const y = this.selectContent == 0 ? y2 : y3
      ctx.strokeRect(x, y, TILESIZE, TILESIZE)
    } else {
      ctx.strokeRect(368, y4, 62, 32)
    }
  }
}
