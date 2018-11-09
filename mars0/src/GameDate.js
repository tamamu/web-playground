export default class GameDate {
  constructor() {
    this.year = 0
    this.month = 0
    this.day = 1
    this.hour = 0
    this.minute = 0
  }
  elapse() {
    while (this.minute >= 60) {
      this.minute -= 60
      this.hour += 1
    }
    while (this.hour >= 24) {
      this.hour -= 24
      this.day += 1
    }
    while (this.month >= 4) {
      this.month -= 4
      this.year += 1
    }
  }
  elapseMinute(n) {
    this.minute += n
    this.elapse()
  }
  elapseDay(h) {
    this.day += 1
    this.hour = h
    this.elapse()
  }
  getPeriod() {
    if (0 <= this.hour && this.hour <= 4) {
      return 'midnight'
    } else if (5 <= this.hour && this.hour <= 10) {
      return 'morning'
    } else if (11 <= this.hour && this.hour <= 13) {
      return 'noon'
    } else if (14 <= this.hour && this.hour <= 17) {
      return 'evening'
    } else if (18 <= this.hour && this.hour <= 21) {
      return 'night'
    } else {
      return 'midnight'
    }
  }
  getSeason() {
    return ['春','夏','秋','冬'][this.month]
  }
  getTime() {
    return `${this.hour}:${('0' + this.minute).slice(-2)}`
  }
  render(ctx, x, y) {
    ctx.fillStyle = 'white'
    ctx.font = "400 12px 'M PLUS Rounded 1c'"
    ctx.fillText(`DATE: ${this.year+1}年 ${this.getSeason()}の月 ${this.day}日`, x, y)
    ctx.fillText(`TIME: ${this.getTime()}`, x, y+12)
  }
  renderPeriodFilter(ctx, w, h) {
    const period = this.getPeriod()
    const m = this.hour * 60 + this.minute
    let r, g, b, a
    if (-270 <= m && m < 120) {
      const t = (m+270)/(120+270)
      r = t * 20
      g = t * 20
      b = 120 - t * 60
      a = 0.5 + t * 0.3
    } else if (120 <= m && m <= 450) {
      const t = (m-120)/(450-120)
      r = 20 + t * 40
      g = 20 + t * 40
      b = 60 + t * 20
      a = 0.8 - t * 0.4
    } else if (450 < m && m <= 720) {
      const t = (m-450)/(720-450)
      r = 60 + t * 195
      g = 60 + t * 195
      b = 80 + t * 120
      a = 0.4 - t * 0.3
    } else if (720 < m && m <= 930) {
      const t = (m-720)/(930-720)
      r = 255
      g = 255 - t * 155
      b = 200 - t * 100
      a = 0.1 + t * 0.2
    } else if (930 < m && m <= 1170) {
      const t = (m-930)/(1170-930)
      r = 255 - t * 255
      g = 100 - t * 100
      b = 100 + t * 20
      a = 0.3 + t * 0.2
    } else if (1170 < m <= 1500) {
      const t = (m-1170)/(1500-1170)
      r = t * 20
      g = t * 20
      b = 120 - t * 60
      a = 0.5 + t * 0.3
    }
    switch (period) {
      case 'midnight':
        ctx.fillStyle = 'rgba(20, 20, 60, 0.8)'
        break
      case 'morning':
        ctx.fillStyle = 'rgba(60, 60, 80, 0.4)'
        break
      case 'noon':
        ctx.fillStyle = 'rgba(255, 255, 200, 0.1)'
        break
      case 'evening':
        ctx.fillStyle = 'rgba(255, 100, 100, 0.3)'
        break
      case 'night':
        ctx.fillStyle = 'rgba(0, 0, 120, 0.5)'
        break
    }
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    ctx.globalAlpha = 1
    ctx.fillRect(0, 0, w, h)
  }
}
