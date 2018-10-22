
import GameObject from './GameObject'

export class CharaStatus {
  constructor(name, maxhp, atk, def, luk, isEnemy=false) {
    this.name = name
    this.maxhp = maxhp
    this.hp = maxhp
    this.atk = atk
    this.def = def
    this.luk = luk
    this.satiety = 3000
    this.maxSatiety = 3000
    this.itemList = [null, null, null, null, null]
    this.money = 0
    this.holding = null
    this.isEnemy = isEnemy
    this.isDead = false
  }
}

export class Character extends GameObject {
  constructor(stat, renderable, x, y, tileId) {
    super(renderable, x, y, tileId)
    this.stat = stat
  }
}

