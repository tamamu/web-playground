
import {Renderable} from "./renderable"
import TileManager from './TileManager'
import FoodState from './Food'
import {ItemState, Item} from './Item'
import SeedState from './Seed'
import WeaponState from './Weapon'

export class TileDictionary {
  constructor(dir) {
    this.searchDir = dir
    this.dict = {}
  }
  register(path, w, h) {
    this.dict[path] = new TileManager(this.searchDir+path, w, h)
  }
  get(path) {
    if (!this.dict[path]) {
      throw new Error(`Tile ${path} has not been loaded.`)
    }
    return this.dict[path]
  }
}

export class ItemDictionary {
  constructor(objList, tileDict) {
    this.src = objList
    this.dict = {}
    for (const obj of objList) {
      let instance
      let tm = tileDict.get(obj.img)
      switch (obj.type) {
        case 'none':
          instance = new ItemState(obj.name)
          break
        case 'food':
          instance = new FoodState(obj.name, obj.satiety)
          break
        case 'weapon':
          instance = new WeaponState(obj.name, obj.weaponType, obj.atk, obj.stableRate)
          break
        case 'seed':
          instance = new SeedState(obj.name, obj.subId, obj.periods, obj.nutrition)
          break
        default:
          break
      }
      this.dict[obj.id] = {
        instance, type: obj.type, tile: tm
      }
    }
  }
  make(id) {
    const obj = this.dict[id]
    if (!obj) {
      throw new Error(`Item ${id} has not been registered`)
    }
    const renderable = new Renderable(0, 0, obj.tile, 0)
    return new Item(obj.instance, renderable, 0, 0, 0)
  }
}
