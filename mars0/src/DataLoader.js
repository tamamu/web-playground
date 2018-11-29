
import {Renderable} from "./renderable"
import TileManager from './TileManager'
import FoodState from './Food'
import {ItemState, Item} from './Item'
import SeedState from './Seed'
import WeaponState from './Weapon'
import {Animatable, Animation, AnimationState, AnimationManager} from "./animation"
import {CharaStatus, Character} from './Character'
import {createWalkAnimatable} from './Walker'


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
     this.dict[obj.id] = {
        data: obj, type: obj.type, tile: tm
      }
    }
  }
  make(id) {
    const obj = this.dict[id]
    if (!obj) {
      throw new Error(`Item ${id} has not been registered`)
    }
    let instance
    switch (obj.data.type) {
      case 'none':
        instance = new ItemState(obj.data.name)
        break
      case 'food':
        instance = new FoodState(obj.data.name, obj.data.satiety)
        break
      case 'weapon':
        instance = new WeaponState(obj.data.name, obj.data.weaponType, obj.data.atk, obj.data.stableRate)
        break
      case 'seed':
        instance = new SeedState(obj.data.name, obj.data.subId, obj.data.periods, obj.data.nutrition)
        break
      default:
        break
    }
    const renderable = new Renderable(0, 0, obj.tile, 0)
    return new Item(instance, renderable, 0, 0, 0)
  }
}

export class CharaDictionary {
  constructor(objList, tileDict) {
    this.src = objList
    this.dict = {}
    for (const obj of objList) {
      let instance = new CharaStatus(obj.name, obj.maxhp, obj.atk, obj.def, obj.lux, obj.exp, true)
      let tm = tileDict.get(obj.img)
      this.dict[obj.id] = {
        instance, tile: tm
      }
    }
  }
  make(id) {
    const obj = this.dict[id]
    if (!obj) {
      throw new Error(`Item ${id} has not been registered`)
    }
    const renderable = new createWalkAnimatable(obj.tile, 0, 0, 1)
    return new Character(CharaStatus.copy(obj.instance), renderable, 0, 0, 1)
  }
}
