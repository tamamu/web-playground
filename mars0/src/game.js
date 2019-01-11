
export default class Game {
  constructor(root, Generator, options=null) {
    this.screen = document.createElement('canvas')
    this.ctx = this.screen.getContext('2d')
    this.lastRendered = new Date()
    this.width = this.screen.clientWidth
    this.height = this.screen.clientHeight
    this.generator = new Generator(this.ctx, options)
    root.appendChild(this.screen)
  }
  size(width, height) {
    this.screen.width = width
    this.width = width
    this.screen.height = height
    this.height = height
  }
  mainLoop() {
    this.generator.update()
    if (Date.now() - this.lastRendered > 1000/120) {
      this.generator.render()
      this.lastRendered = Date.now()
    }
    requestAnimationFrame(this.mainLoop.bind(this))
  }
}

