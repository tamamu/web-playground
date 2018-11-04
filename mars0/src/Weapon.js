
import {ItemState, Item} from './Item'

export default class WeaponState extends ItemState {
  constructor(name, type, atk, stableRate = 0.5) {
    super(name)
    this.type = 'weapon'
    this.weaponType = type
    this.atk = atk
    this.isStable = false
    this.stableRate = stableRate
    this.water = this.weaponType == 'watering' ? 0 : null
  }
  get screenName() {
    let n = this.name
    if (this.isSoiled) {
      n = '土を被った' + n
    }
    if (!this.isStable) {
      n = '不安定な' + n
    }
    return n
  }
}

