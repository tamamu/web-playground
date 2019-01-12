
import {ItemState} from './Item'

export default class SeedState extends ItemState {
  constructor(name, item, growthPeriods, minimumNutrition) {
    super(name)
    this.type = 'seed'
    this.species = item
    this.requireTime = growthPeriods[growthPeriods.length-1]
    this.growthPeriods = growthPeriods
    this.minimumNutrition = minimumNutrition
  }
}

