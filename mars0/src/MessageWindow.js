
export default class MessageWindow {
  constructor(maxlen, fontsize) {
    this.messages = []
    this.maxlen = maxlen
    this.fontSize = fontsize
    this.height = 32+(this.fontSize+6)*this.maxlen
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
    ctx.font = `400 ${this.fontSize}px 'M PLUS Rounded 1c'`
    ctx.lineJoin = 'round'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(x+12, y+12, 800-24, this.height-24)
    ctx.strokeStyle = 'white'
    ctx.strokeRect(x+12, y+12, 800-24, this.height-24)
    for (let j=0; j < this.messages.length; ++j) {
      ctx.fillStyle = 'white'
      ctx.fillText(this.messages[j], 18, y+18+this.fontSize*j+6*j)
    }
  }
}

