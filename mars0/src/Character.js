
import GameObject from './GameObject'

export class CharaStatus {
  constructor(name, maxhp, atk, def, luk, exp, enemyId=null, superiorId=null) {
    this.name = name
    this.maxhp = maxhp
    this.hp = maxhp
    this.atk = atk
    this.def = def
    this.luk = luk
    this.satiety = 1200
    this.maxSatiety = 1200
    this.itemList = [null, null, null, null, null]
    this.money = 0
    this.holding = null
    this.enemyId = enemyId
    this.superiorId = superiorId
    this.isDead = false
    this.removeMarked = false
    this.exp = exp ? exp : 0
    this.maxexp = 10
    this.lv = 1
  }
  static copy(stat) {
    return new CharaStatus(stat.name, stat.maxhp, stat.atk, stat.def, stat.luk, stat.exp, stat.enemyId, stat.superiorId)
  }
}

export class Character extends GameObject {
  constructor(stat, renderable, x, y, tileId) {
    super(renderable, x, y, tileId)
    this.stat = stat
  }
}

