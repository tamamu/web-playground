
import {ItemState, Item} from './Item'

export default class WeaponState extends ItemState {
  constructor(name, type, atk) {
    super(name)
    this.type = 'weapon'
    this.weaponType = type
    this.atk = atk
    this.isSoiled = false
    this.isStable = false
  }
}

