
export default class Game {
  constructor(root, generator, options=null) {
    this.screen = document.createElement('canvas')
    this.ctx = this.screen.getContext('2d')
    this.lastRendered = new Date()
    this.width = this.screen.clientWidth
    this.height = this.screen.clientHeight
    this.generator = new generator(this.ctx, options)
    root.appendChild(this.screen)
  }
  size(width, height) {
    this.width = this.screen.width = width
    this.height = this.screen.height = height
  }
  mainLoop() {
    this.generator.update()
    if (new Date - this.lastRendered > 1000/120) {
      this.generator.render()
      this.lastRendered = new Date()
    }
    requestAnimationFrame(this.mainLoop.bind(this))
  }
}

