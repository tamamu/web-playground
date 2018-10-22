
import {ItemState, Item} from './Item'

export default class FoodState extends ItemState {
  constructor(name, satiety) {
    super(name)
    this.type = 'food'
    this.satiety = satiety
  }
}

