
import {drawWindow} from './Window'
import {TILESIZE} from './constants'

export default class SelectWindow {
  constructor(keystore, choices, callbacks) {
    this.keyStore = keystore
    this.choices = choices
    this.callbacks = callbacks
    this.cursor = 0
    this.closed = false
  }
  input() {
    if (new Date() - this.keyStore.lastDown < 80) {
      return 1
    }
    this.keyStore.lastDown = new Date()
    const keys = this.keyStore.get()
    if (keys['ArrowUp']) {
      this.cursor = this.cursor - 1
      if (this.cursor < 0) {
        this.cursor = this.choices.length-1
      }
    } else if (keys['ArrowDown']) {
      this.cursor = this.cursor + 1
      if (this.cursor >= this.choices.length) {
        this.cursor = 0
      }
    }
    if (keys[' ']) {
      this.callbacks[this.cursor]()
      this.closed = true
      return 0
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
        yield 0
      }
      return this.cursor
    }
    return 0
  }
  render(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(0, 0, 800, 600)
    ctx.fillStyle = 'white'
    ctx.font = "400 18px 'M PLUS Rounded 1c'"
    const y1 = 56
    drawWindow(ctx, 250, y1, 120, 22*this.choices.length)
    ctx.fillStyle = 'white'
    for (let j=0; j < this.choices.length; ++j) {
      const choice = this.choices[j]
      if (j == this.cursor) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.fillRect(250, y1 + 22*j, 120, 22)
      }
      ctx.fillStyle = 'white'
      ctx.fillText(choice, 250, y1 + 22 * j)
    }
  }
}
