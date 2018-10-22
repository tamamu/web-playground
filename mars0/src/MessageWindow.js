
export default class MessageWindow {
  constructor(maxlen, fontsize) {
    this.messages = []
    this.maxlen = maxlen
    this.fontSize = fontsize
    this.height = (this.fontSize+4)*this.maxlen
    this.width = 800
  }
  push(mes) {
    this.messages.push(mes)
    while (this.messages.length > this.maxlen) {
      this.messages.shift()
    }
  }
  render(ctx, x, y) {
    ctx.textBaseline = 'top'
    ctx.font = `${this.fontSize}px sans`
    ctx.fillStyle = 'rgba(50, 50, 50, 0.7)';
    ctx.fillRect(x, y, 800, this.height)
    for (let j=0; j < this.messages.length; ++j) {
      ctx.fillStyle = 'white'
      ctx.fillText(this.messages[j], 0, y+this.fontSize*j+4*j)
    }
  }
}

