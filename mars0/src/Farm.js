
import GameObject from './GameObject'

export class Seedling {
  constructor(seed) {
    this.seed = seed
    this.nutrition = 0
    this.period = 0
    this.elapsed = 0
  }
}

export class FarmState {
  constructor(seedling, nutrition, water) {
    this.seedling = seedling
    this.nutrition = nutrition
    this.water = water
  }
}

export class Farm extends GameObject {
  constructor(stat, renderable, x, y) {
    super(renderable, x, y, 100)
    this.stat = stat
  }
}

