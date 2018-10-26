
import {KeyboardStore} from "./keyboard"
import {Renderable} from "./renderable"
import {Animatable, Animation, AnimationState, AnimationManager} from "./animation"
import GameObject from './GameObject'
import TileManager from './TileManager'
import {TILESIZE} from './constants'
import MessageWindow from './MessageWindow'
import Camera from './Camera'
import {CharaStatus, Character} from './Character'
import {Seedling, FarmState, Farm} from './Farm'
import FoodState from './Food'
import {ItemState, Item} from './Item'
import SeedState from './Seed'
import WeaponState from './Weapon'

function checkEvent() {
  //console.log("checkEvent")
}

function checkGrowth() {
  //console.log("checkGrowth")
}

function animationTrigger() {
  //console.log("animationTrigger")
}

function playerAction() {
  //console.log("playerAction")
}

function checkPlayerFloor() {
  //console.log("checkPlayerFloor")
}

function npcAction() {
  //console.log("npcAction")
}

function checkNpcFloor() {
  //console.log("checkNpcFloor")
}

const testMap = [
  [
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
    [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,],
  ],[
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,86,87,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,80,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,104,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,80,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,104,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,89,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,88,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,208,209,210,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,48,49,48,49,48,49,48,49,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,216,217,218,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,64,73,72,73,72,73,72,65,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,224,225,226,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,64,73,72,73,72,73,72,65,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,64,73,72,73,72,73,72,65,-1,-1,-1,],
    [-1,-1,85,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,93,93,-1,-1,-1,64,73,72,73,72,73,72,65,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,64,73,72,73,72,73,72,65,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,64,73,72,73,72,73,72,65,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,95,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,64,73,72,73,72,73,72,65,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,64,73,72,73,72,73,72,65,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,64,73,72,73,72,73,72,65,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,64,65,56,57,56,57,56,57,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,56,57,-1,-1,-1,-1,-1,92,-1,-1,-1,]
  ]
]

/*
const testMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]
*/



function createWalkAnimatable(tm, x, y, tileId) {
  return new Animatable(x, y, tm, tileId, {
    "right-attack": [
      new AnimationState(TILESIZE, 0, 7, 100),
      new AnimationState(-TILESIZE, 0, 7, 100),
    ],
    "right": [
      new AnimationState(TILESIZE/4, 0, 6, 48),
      new AnimationState(TILESIZE/4, 0, 7, 48),
      new AnimationState(TILESIZE/4, 0, 8, 48),
      new AnimationState(TILESIZE/4, 0, 7, 48),
    ],
    "left-attack": [
      new AnimationState(-TILESIZE, 0, 4, 100),
      new AnimationState(TILESIZE, 0, 4, 100),
    ],
    "left": [
      new AnimationState(-TILESIZE/4, 0, 3, 48),
      new AnimationState(-TILESIZE/4, 0, 4, 48),
      new AnimationState(-TILESIZE/4, 0, 5, 48),
      new AnimationState(-TILESIZE/4, 0, 4, 48),
    ],
    "up-attack": [
      new AnimationState(0, -TILESIZE, 10, 100),
      new AnimationState(0, TILESIZE, 10, 100),
    ],
    "up": [
      new AnimationState(0, -TILESIZE/4, 9, 48),
      new AnimationState(0, -TILESIZE/4, 10, 48),
      new AnimationState(0, -TILESIZE/4, 11, 48),
      new AnimationState(0, -TILESIZE/4, 10, 48),
    ],
    "down-attack": [
      new AnimationState(0, TILESIZE, 1, 100),
      new AnimationState(0, -TILESIZE, 1, 100),
    ],
    "down": [
      new AnimationState(0, TILESIZE/4, 0, 48),
      new AnimationState(0, TILESIZE/4, 1, 48),
      new AnimationState(0, TILESIZE/4, 2, 48),
      new AnimationState(0, TILESIZE/4, 1, 48),
    ],
    "down-right": [
      new AnimationState(TILESIZE/4, TILESIZE/4, 0, 48),
      new AnimationState(TILESIZE/4, TILESIZE/4, 1, 48),
      new AnimationState(TILESIZE/4, TILESIZE/4, 2, 48),
      new AnimationState(TILESIZE/4, TILESIZE/4, 1, 48),
    ],
    "down-left": [
      new AnimationState(-TILESIZE/4, TILESIZE/4, 0, 48),
      new AnimationState(-TILESIZE/4, TILESIZE/4, 1, 48),
      new AnimationState(-TILESIZE/4, TILESIZE/4, 2, 48),
      new AnimationState(-TILESIZE/4, TILESIZE/4, 1, 48),
    ],
    "up-right": [
      new AnimationState(TILESIZE/4, -TILESIZE/4, 9, 48),
      new AnimationState(TILESIZE/4, -TILESIZE/4, 10, 48),
      new AnimationState(TILESIZE/4, -TILESIZE/4, 11, 48),
      new AnimationState(TILESIZE/4, -TILESIZE/4, 10, 48),
    ],
    "up-left": [
      new AnimationState(-TILESIZE/4, -TILESIZE/4, 9, 48),
      new AnimationState(-TILESIZE/4, -TILESIZE/4, 10, 48),
      new AnimationState(-TILESIZE/4, -TILESIZE/4, 11, 48),
      new AnimationState(-TILESIZE/4, -TILESIZE/4, 10, 48),
    ],
  })
}

export default class MarsZero {
  constructor(ctx) {
    this.ctx = ctx
    this.field = testMap
    this.syncAM = new AnimationManager()
    this.asyncAM = new AnimationManager()
    this.renderableList = []
    this.farmList = this.renderableList[0] = []
    this.dropList = this.renderableList[1] = []
    this.playerList = this.renderableList[2] = []
    this.npcList = this.renderableList[3] = []
    this.holdingList = this.renderableList[4] = []
    this.keyStore = new KeyboardStore()
    this.messageWindow = new MessageWindow(5, 20)
    this.camera = new Camera()
    this.inventoryTimer = new Date()
    this.showInventory = false
    this.inventoryOpacity = 0
    document.addEventListener("keydown", this.keyStore.onKeyDown.bind(this.keyStore))
    document.addEventListener("keyup", this.keyStore.onKeyUp.bind(this.keyStore))
    // Tile Manage Test {
      this.tm1 = new TileManager("./resources/base.png", 16, 16)
      this.tm2 = new TileManager("./resources/kabe-ue_doukutu1.png", 16, 16)
      this.tm3 = new TileManager("./resources/pipo-charachip002a.png", 32, 32)
      let tm4 = new TileManager("./resources/pipo-charachip019c.png", 32, 32)
      this.tm_coin = new TileManager("./resources/icon020.png", 24, 24)
      this.tm_apple = new TileManager("./resources/icon028.png", 24, 24)
      this.tm_sword = new TileManager("./resources/icon002.png", 24, 24)
      this.tm_spear = new TileManager("./resources/icon004.png", 24, 24)
      this.tm_hammer = new TileManager("./resources/icon003.png", 24, 24)
      let tm_seed = new TileManager("./resources/icon021.png", 24, 24)
    // } End Tile Manage Test
    // Animation Test {
      let p = createWalkAnimatable(this.tm3, 1*TILESIZE, 1*TILESIZE, 1)
      let c = new Renderable(1*TILESIZE, 4*TILESIZE, this.tm_coin, 0)
      let a = new Renderable(8*TILESIZE, 8*TILESIZE, this.tm_apple, 0)
      let sw = new Renderable(10*TILESIZE, 4*TILESIZE, this.tm_sword, 0)
      let sp = new Renderable(10*TILESIZE, 5*TILESIZE, this.tm_spear, 0)
      let ha = new Renderable(10*TILESIZE, 6*TILESIZE, this.tm_hammer, 0)
      let pStat = new CharaStatus("You", 50, 10, 9, 8)
      let cStat = new ItemState("Coin")
      let aStat = new FoodState("Apple", 300)
      let swStat = new WeaponState("Sword", 'sword', 20)
      let spStat = new WeaponState("Spear", 'spear', 20)
      let haStat = new WeaponState("Hammer", 'hammer', 20)
      function makeEnemy(x, y) {
        let e = createWalkAnimatable(tm4, x*TILESIZE, y*TILESIZE, 5)
        return new Character(new CharaStatus("Enemy", 30, 10, 10, 10, true), e, x, y)
      }
      this.player = new Character(pStat, p, 1, 1, 1)
      this.coin = new Item(cStat, c, 1, 4, 0)
      this.apple = new Item(aStat, a, 8, 8, 0)
      this.sword = new Item(swStat, sw, 10, 4, 0)
      this.spear = new Item(spStat, sp, 10, 5, 0)
      this.hammer = new Item(haStat, ha, 10, 6, 0)
      let sStat = new SeedState("CoinSeed", this.coin, [5], 3)
      function makeCoinSeed(x, y) {
        let s = new Renderable(x*TILESIZE, y*TILESIZE, tm_seed, 0)
        return new Item(sStat, s, x, y, 0)
      }
      this.dropList.push(this.coin)
      this.dropList.push(this.apple)
      this.dropList.push(this.sword)
      this.dropList.push(this.spear)
      this.dropList.push(this.hammer)
      this.dropList.push(makeCoinSeed(10, 10))
      this.dropList.push(makeCoinSeed(8, 7))
      this.dropList.push(makeCoinSeed(12, 5))
      this.dropList.push(makeCoinSeed(16, 1))
      this.dropList.push(makeCoinSeed(1, 5))
      //this.renderableList.push(p)
      //this.renderableList.push(e)
      //this.renderableList.push(c)
      this.playerList.push(this.player)
      this.npcList.push(makeEnemy(3, 3))
      this.npcList.push(makeEnemy(3, 4))
      this.npcList.push(makeEnemy(4, 3))
      this.npcList.push(makeEnemy(4, 4))
      this.npcList.push(makeEnemy(4, 5))
      this.npcList.push(makeEnemy(5, 4))
    // } End Animation Test

    this.lifecycle = this.genLifeCycle()
  }
  colWall(x, y) {
    if (y >= this.field[0].length || y < 0 || x >= this.field[0][y].length || x < 0) {
      return true
    }
    return this.field[0][y][x] == 1
  }
  collision(x, y) {
    if (y >= this.field[0].length || y < 0 || x >= this.field[0][y].length || x < 0) {
      return true
    }
    return this.field[0][y][x] == 1 || this.detectEnemy(x, y) || (this.player.x == x && this.player.y == y)
  }
  detectEnemy(x, y) {
    console.log(this.npcList)
    for (const npc of this.npcList) {
      if (npc.x == x && npc.y == y && npc.stat.isEnemy) {
        return npc
      }
    }
    return null
  }
  damage(from, to, damage) {
    this.messageWindow.push(`${from.stat.name}は${to.stat.name}に${damage}のダメージを与えた！`)
    to.stat.hp -= damage
    if (to.stat.hp <= 0) {
      to.stat.isDead = true
    }
  }
  calcDamage(atk, def) {
    return Math.floor(atk*Math.pow(15/16, def)*(Math.random()*0.4+0.8))
  }
  playerAttack() {
    let enemies = []
    let holding = this.player.stat.holding
    let weapon = null
    if (holding && holding.stat.type == 'weapon') {
      weapon = holding
    }
    let attackRange = []
    switch (this.player.direction) {
      case 'down':
        attackRange.push([this.player.x, this.player.y+1, 1])
        break
      case 'left':
        attackRange.push([this.player.x-1, this.player.y, 1])
        break
      case 'right':
        attackRange.push([this.player.x+1, this.player.y, 1])
        break
      case 'up':
        attackRange.push([this.player.x, this.player.y-1, 1])
        break
    }
    if (weapon) {
      switch (weapon.stat.weaponType) {
        case 'spear':
          switch (this.player.direction) {
            case 'down':
              if (!this.colWall(this.player.x, this.player.y+1)) {
                attackRange.push([this.player.x, this.player.y+2, 0.6])
              }
              break
            case 'left':
              if (!this.colWall(this.player.x-1, this.player.y)) {
                attackRange.push([this.player.x-2, this.player.y, 0.6])
              }
              break
            case 'right':
              if (!this.colWall(this.player.x+1, this.player.y)) {
                attackRange.push([this.player.x+2, this.player.y, 0.6])
              }
              break
            case 'up':
              if (!this.colWall(this.player.x, this.player.y-1)) {
                attackRange.push([this.player.x, this.player.y-2, 0.6])
              }
              break
            default:
          }
          break
        case 'hammer':
          switch (this.player.direction) {
            case 'down':
              if (!this.colWall(this.player.x, this.player.y+1)) {
                attackRange.push([this.player.x, this.player.y+2, 0.2])
                attackRange.push([this.player.x-1, this.player.y+1, 0.2])
                attackRange.push([this.player.x+1, this.player.y+1, 0.2])
              }
              break
            case 'left':
              if (!this.colWall(this.player.x-1, this.player.y)) {
                attackRange.push([this.player.x-2, this.player.y, 0.2])
                attackRange.push([this.player.x-1, this.player.y+1, 0.2])
                attackRange.push([this.player.x-1, this.player.y-1, 0.2])
              }
              break
            case 'right':
              if (!this.colWall(this.player.x+1, this.player.y)) {
                attackRange.push([this.player.x+2, this.player.y, 0.2])
                attackRange.push([this.player.x+1, this.player.y+1, 0.2])
                attackRange.push([this.player.x+1, this.player.y-1, 0.2])
              }
              break
            case 'up':
              if (!this.colWall(this.player.x, this.player.y-1)) {
                attackRange.push([this.player.x, this.player.y-2, 0.2])
                attackRange.push([this.player.x+1, this.player.y-1, 0.2])
                attackRange.push([this.player.x-1, this.player.y-1, 0.2])
              }
              break
            default:
          }
        default:
      }
    }
    attackRange.map(p => {
      let e = this.detectEnemy(p[0], p[1])
      if (e) enemies.push({target: e, mag: p[2]})
    })
    let cameraFixed = this.camera.isFixed
    if (!cameraFixed) this.camera.fix()
    this.syncAM.push(new Animation(this.player.renderable, `${this.player.direction}-attack`, () => {
      if (enemies.length > 0) {
        console.log(`${enemies.length} enemies`)
        enemies.map(e => {
          let damage = Math.max(0, this.calcDamage((this.player.stat.atk + (weapon ? weapon.stat.atk : 0))*e.mag, e.target.stat.def))
          this.damage(this.player, e.target, damage)
        })
      } else {
        this.messageWindow.push("そこには誰もいない。")
      }
      if (!cameraFixed) this.camera.unfix()
    }))
    return 2
  }
  npcAttack(npc) {
    let enemy = null
    switch (npc.direction) {
      case 'down':
        enemy = (npc.x==this.player.x && npc.y+1==this.player.y) ? this.player : this.detectEnemy(npc.x, npc.y+1)
        break
      case 'left':
        enemy = (npc.x-1==this.player.x && npc.y==this.player.y) ? this.player : this.detectEnemy(npc.x-1, npc.y)
        break
      case 'right':
        enemy = (npc.x+1==this.player.x && npc.y==this.player.y) ? this.player : this.detectEnemy(npc.x+1, npc.y)
        break
      case 'down':
        enemy = (npc.x==this.player.x && npc.y-1==this.player.y) ? this.player : this.detectEnemy(npc.x, npc.y-1)
        break
    }
    this.syncAM.push(new Animation(npc.renderable, `${npc.direction}-attack`, () => {
      if (enemy) {
        let damage = Math.max(0, this.calcDamage(npc.stat.atk, enemy.stat.def))
        this.damage(npc, enemy, damage)
      }
    }))
  }
  playerAction() {
    if (new Date() - this.keyStore.lastGet < 1000/10) {
      return 0
    }
    let keys = this.keyStore.get()
    if (keys["ArrowDown"]) {
      this.player.direction = 'down'
      if (this.collision(this.player.x, this.player.y+1) || this.detectEnemy(this.player.x, this.player.y+1)) {
        return 0
      }
      if (keys["ArrowRight"]) {
        if (this.collision(this.player.x+1, this.player.y+1) || this.collision(this.player.x+1, this.player.y) || this.detectEnemy(this.player.x+1, this.player.y)) {
          return 0
        }
        this.syncAM.push(new Animation(this.player.renderable, "down-right"))
        this.player.x += 1
        this.player.y += 1
      } else if (keys["ArrowLeft"]) {
        if (this.collision(this.player.x-1, this.player.y+1) || this.detectEnemy(this.player.x-1, this.player.y+1)) {
          return 0
        }
        this.syncAM.push(new Animation(this.player.renderable, "down-left"))
        this.player.x -= 1
        this.player.y += 1
      } else {
        this.syncAM.push(new Animation(this.player.renderable, "down"))
        this.player.y += 1
      }
      return 1
    } else if (keys["ArrowUp"]) {
      this.player.direction = 'up'
      if (this.collision(this.player.x, this.player.y-1) || this.detectEnemy(this.player.x, this.player.y-1)) {
        return 0
      }
      if (keys["ArrowRight"]) {
        if (this.collision(this.player.x+1, this.player.y-1) || this.collision(this.player.x+1, this.player.y) || this.detectEnemy(this.player.x+1, this.player.y)) {
          return 0
        }
        this.syncAM.push(new Animation(this.player.renderable, "up-right"))
        this.player.x += 1
        this.player.y -= 1
      } else if (keys["ArrowLeft"]) {
        if (this.collision(this.player.x-1, this.player.y-1) || this.collision(this.player.x-1, this.player.y) || this.detectEnemy(this.player.x-1, this.player.y)) {
          return 0
        }
        this.syncAM.push(new Animation(this.player.renderable, "up-left"))
        this.player.x -= 1
        this.player.y -= 1
      } else {
        this.syncAM.push(new Animation(this.player.renderable, "up"))
        this.player.y -= 1
      }
      return 1
    } else if (keys["ArrowLeft"]) {
      this.player.direction = 'left'
      if (this.collision(this.player.x-1, this.player.y) || this.detectEnemy(this.player.x-1, this.player.y)) {
        return 0
      }
      this.syncAM.push(new Animation(this.player.renderable, "left"))
      this.player.x -= 1
      return 1
    } else if (keys["ArrowRight"]) {
      this.player.direction = 'right'
      if (this.collision(this.player.x+1, this.player.y) || this.detectEnemy(this.player.x+1, this.player.y)) {
        return 0
      }
      this.syncAM.push(new Animation(this.player.renderable, "right"))
      this.player.x += 1
      return 1
    } else if (keys["Shift"]) {
      this.playerPickUp()
      //return true
      return 0
    } else if (keys[" "]) {
      console.log(this.player.direction)
      if (this.player.stat.holding && this.player.stat.holding.stat.type != 'weapon') {
        return this.playerUseHolding()
      } else {
        return this.playerAttack()
      }
    } else if (keys["j"]) {
      this.playerInventorySpin(true)
      return 0
    } else if (keys["k"]) {
      this.playerInventorySpin()
    }
    return 0
  }
  playerInventorySpin(backward) {
    this.showInventory = true
    this.inventoryTimer = new Date()
    let holding = this.player.stat.holding
    let head = null
    console.log(this.player.stat.itemList)
    if (backward) {
      this.player.stat.itemList.push(holding)
      head = this.player.stat.itemList.shift()
    } else {
      this.player.stat.itemList.unshift(holding)
      head = this.player.stat.itemList.pop()
    }
    console.log(holding)
    console.log(head)
    if (holding != null) {
      if (head != null) {
        this.messageWindow.push(`${this.player.stat.name}は${holding.stat.name}をカバンにしまい、${head.stat.name}を取り出した。`)
      } else {
        this.messageWindow.push(`${this.player.stat.name}は${holding.stat.name}をカバンにしまった。`)
      }
    } else {
      if (head) {
        this.messageWindow.push(`${this.player.stat.name}は${head.stat.name}を取り出した。`)
      }
    }
    this.player.stat.holding = head
  }
  playerUseHolding() {
    const holding = this.player.stat.holding
    switch (holding.stat.type) {
      case 'seed':
        this.playerPlant()
        break
      case 'food':
        this.playerEat()
        break
      case 'weapon':
        this.playerAttack()
        break
      default:
        this.messageWindow.push(`${this.player.stat.name}は${holding.stat.name}を使おうとしたが、使い方が分からない！`)
        break
    }
    return 2
  }
  playerEat() {
    const holding = this.player.stat.holding
    this.player.stat.satiety += holding.stat.satiety
    this.messageWindow.push(`${this.player.stat.name}は${holding.stat.name}を食べた。`)
    this.messageWindow.push(`お腹が膨れた。`)
    this.player.stat.holding = null
  }
  playerPlant() {
    const holding = this.player.stat.holding
    let farm = new Farm(
      new FarmState(new Seedling(holding.stat), 5, 5),
      new Renderable(this.player.x*TILESIZE, this.player.y*TILESIZE, this.tm1, 100),
      this.player.x,
      this.player.y
    )
    this.messageWindow.push(`${this.player.stat.name}は${holding.stat.name}を地面に植えた。`)
    this.farmList.push(farm)
    this.player.stat.holding = null
    return 2
  }
  harvest(farm) {
    const seedling = farm.stat.seedling
    const seed = seedling.seed
    const finalPeriod = seed.growthPeriods.length-1
    if (seedling.period >= finalPeriod && seedling.elapsed >= seed.growthPeriods[finalPeriod]) {
      console.log(seed)
      let renderable = Renderable.copy(seed.species.renderable)
      let item = new Item(seed.species.stat, renderable, farm.x, farm.y, renderable.prop.tileId)
      console.log(item)
      return item
    }
    return null
  }
  playerPickUp() {
    this.showInventory = true
    this.inventoryTimer = new Date()
    let target = null
    for (let j = 0; j < this.farmList.length; ++j) {
      if (this.player.x == this.farmList[j].x && this.player.y == this.farmList[j].y) {
        target = this.harvest(this.farmList[j])
        if (target) {
          this.farmList.splice(j, 1)
          break
        }
      }
    }
    for (let j = 0; j < this.dropList.length; ++j) {
      if (this.player.x == this.dropList[j].x && this.player.y == this.dropList[j].y) {
        target = this.dropList[j]
        this.dropList.splice(j, 1)
        break
      }
    }
    if (target) {
      if (this.player.stat.holding) {
        let holding = this.player.stat.holding
        holding.move(this.player.x, this.player.y)
        this.player.stat.holding = target
        this.dropList.push(holding)
        this.messageWindow.push(`${target.stat.name}と床に落ちている${holding.stat.name}を交換した。`)
      } else {
        this.player.stat.holding = target
        this.messageWindow.push(`${target.stat.name}を拾った。`)
      }
    } else {
      if (this.player.stat.holding) {
        let holding = this.player.stat.holding
        holding.move(this.player.x, this.player.y)
        this.dropList.push(holding)
        this.player.stat.holding = null
        this.messageWindow.push(`${holding.stat.name}を足元に置いた。`)
      } else {
        this.messageWindow.push("そこには何もない。")
      }
    }
  }
  npcAction() {
    for (let npc of this.npcList) {
      if (Math.random() < 0.3) {
        return this.npcAttack(npc)
      }
      let x = Math.floor(Math.random() * 3 - 1)
      let y = Math.floor(Math.random() * 3 - 1)
      if (y < 0 && !this.collision(npc.x, npc.y+y)) {
        npc.direction = 'up'
        if (x < 0 && !this.collision(npc.x+x, npc.y+y)) {
          this.syncAM.push(new Animation(npc.renderable, "up-left", () => {
            npc.x -= 1
            npc.y -= 1
          }))
        } else if (x > 0 && !this.collision(npc.x+x, npc.y+y)) {
          this.syncAM.push(new Animation(npc.renderable, "up-right", () => {
            npc.x += 1
            npc.y -= 1
          }))
        } else {
          this.syncAM.push(new Animation(npc.renderable, "up", () => {
            npc.y -= 1
          }))
        }
      } else if (y > 0 && !this.collision(npc.x, npc.y+y)) {
        npc.direction = 'down'
        if (x < 0 && !this.collision(npc.x+x, npc.y+y)) {
          this.syncAM.push(new Animation(npc.renderable, "down-left", () => {
            npc.x -= 1
            npc.y += 1
          }))
        } else if (x > 0 && !this.collision(npc.x+x, npc.y+y)) {
          this.syncAM.push(new Animation(npc.renderable, "down-right", () => {
            npc.x += 1
            npc.y += 1
          }))
        } else {
          this.syncAM.push(new Animation(npc.renderable, "down", () => {
            npc.y += 1
          }))
        }
      } else if (x < 0 && !this.collision(npc.x+x, npc.y)) {
        npc.direction = 'left'
        this.syncAM.push(new Animation(npc.renderable, "left", () => {
          npc.x -= 1
        }))
      } else if (x > 0 && !this.collision(npc.x+x, npc.y)) {
        npc.direction = 'right'
        this.syncAM.push(new Animation(npc.renderable, "right", () => {
          npc.x += 1
        }))
      }
    }
  }
  checkPlayerFloor() {
    for (let item of this.dropList) {
      if (this.player.x == item.x && this.player.y == item.y) {
        this.messageWindow.push(`${item.stat.name}が床に落ちている。`)
      }
    }
    for (let farm of this.farmList) {
      if (this.player.x == farm.x && this.player.y == farm.y) {
        this.messageWindow.push(`${farm.stat.seedling.seed.name}の畑がある。`)
      }
    }
  }
  removeDeadCharas() {
    console.log(this.renderableList)
    console.log(this.npcList)
    this.npcList = this.renderableList[3] = this.npcList.filter(x => {
      if (x.stat.isDead) {
        this.messageWindow.push(`${x.stat.name}を倒した。`)
        return false
      }
      return true
    })
  }
  checkGrowth() {
    for (let farm of this.farmList) {
      console.log(farm)
      let seedling = farm.stat.seedling
      const seed = seedling.seed
      seedling.nutrition = farm.stat.water <= 0 ? 0 : farm.stat.nutrition
      seedling.elapsed += seedling.nutrition >= seed.minimumNutrition ? 1 : 0
      if (seedling.elapsed < seed.growthPeriods[seedling.period] && seed.growthPeriods.length <= seedling.period) {
        seedling.period += 1
      }
      farm.stat.water = Math.max(0, farm.stat.water-1)
    }
  }
  updatePlayerStatus() {
    this.player.stat.satiety -= 1
    if (this.player.stat.satiety == Math.ceil(this.player.stat.maxSatiety*0.5)) {
      this.messageWindow.push(`${this.player.stat.name}はお腹がすいた。`)
    }
    if (this.player.stat.satiety == Math.ceil(this.player.stat.maxSatiety*0.3)) {
      this.messageWindow.push(`${this.player.stat.name}はとてもお腹がすいている。`)
    }
    if (this.player.stat.satiety == 0) {
      this.messageWindow.push(`${this.player.stat.name}はお腹がすいて死にそうだ。`)
    }
    if (this.player.stat.satiety < 0) {
      this.player.stat.hp += this.player.stat.satiety
    }
  }
  *genLifeCycle() {
    while(true) {
      checkEvent()
      //yield 1
      this.checkGrowth()
      //yield 2
      PlayerTurn: while (true) {
        switch (this.playerAction()) {
          case 0:
            yield 3
            break
          case 1:
            break PlayerTurn
          case 2:
            yield 3
            break PlayerTurn
        }
      }
      this.updatePlayerStatus()
      this.removeDeadCharas()
      this.npcAction()
      this.checkPlayerFloor()
      checkNpcFloor()
      //yield 5
    }
  }
  renderInfo(mx, my, gx, gy) {
    this.ctx.font = '40px sans'
    this.ctx.fillStyle = 'white'
    const stat = this.player.stat
    const hp = stat.hp
    const maxhp = stat.maxhp
    const money = stat.money
    const satiety = Math.ceil((stat.satiety / stat.maxSatiety) * 100)
    this.ctx.fillText('1F', 32, 12)
    this.ctx.fillText(`Lv 1`, 120, 12)
    this.ctx.fillText(`HP  ${hp}/${maxhp}`, 300, 12)
    this.ctx.fillText(`${satiety}%`, 560, 12)
    this.ctx.textAlign = 'right'
    this.ctx.fillText(`${money}G`, 768, 12)
    this.ctx.textAlign = 'start'
  }
  renderPlayerInventory(mx, my, gx, gy) {
    const inventory = this.player.stat.itemList
    const x = 460, y = 412
    this.ctx.globalAlpha = this.inventoryOpacity
    this.ctx.fillStyle = 'rgba(50, 50, 50, 0.7)'
    this.ctx.fillRect(x, y, TILESIZE*inventory.length, TILESIZE)
    this.ctx.beginPath()
    this.ctx.moveTo(x+TILESIZE*(inventory.length+1)+8, y)
    this.ctx.lineTo(x+TILESIZE*(inventory.length+1)+32, y+TILESIZE/2)
    this.ctx.lineTo(x+TILESIZE*(inventory.length+1)+8, y+TILESIZE)
    this.ctx.moveTo(x-8, y)
    this.ctx.lineTo(x-32, y+TILESIZE/2)
    this.ctx.lineTo(x-8, y+TILESIZE)
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.fillStyle = 'white'
    this.ctx.fillText('J', x-18, y+6)
    this.ctx.fillText('K', x+TILESIZE*(inventory.length+1)+10, y+6)
    for (let j=0; j < inventory.length; ++j) {
      let item = inventory[j]
      if (item) {
        item.renderable.tiles.render(this.ctx, item.renderable.prop.tileId, x+TILESIZE*j, y, TILESIZE, TILESIZE)
      }
    }
    this.ctx.globalAlpha = 1
    this.ctx.font = '12px sans'
    this.ctx.fillText('HOLD', x+TILESIZE*inventory.length, y-14)
    this.ctx.fillStyle = 'rgba(50, 50, 50, 0.7)'
    this.ctx.fillRect(x+TILESIZE*inventory.length, y, TILESIZE, TILESIZE)
    if (this.player.stat.holding) {
      this.player.stat.holding.renderable.tiles.render(this.ctx, this.player.stat.holding.renderable.prop.tileId, x+TILESIZE*inventory.length, y, TILESIZE, TILESIZE)
    }
    this.ctx.strokeStyle = 'white'
    this.ctx.strokeRect(x+TILESIZE*inventory.length, y, TILESIZE, TILESIZE)
  }
  renderFarmStat(mx, my, gx, gy) {
    this.farmList.map(x => {
      const farm = x.renderable
      const stat = x.stat
      const seedling = stat.seedling
      const remain = seedling.seed.requireTime - seedling.elapsed
      const requireWater = seedling.nutrition == 0 && stat.water == 0
      this.ctx.font = `${TILESIZE/4}px sans`
      if (remain == 0) {
        this.ctx.fillStyle = 'yellow'
        this.ctx.fillText("収穫可能", farm.prop.x+gx, farm.prop.y+gy+TILESIZE-8)
      } else if (requireWater) {
        this.ctx.fillStyle = 'lightblue'
        this.ctx.fillText("水必要", farm.prop.x+gx, farm.prop.y+gy+TILESIZE-8)
      } else {
        this.ctx.fillStyle = 'lightgreen'
        this.ctx.fillText(`あと${remain}歩`, farm.prop.x+gx, farm.prop.y+gy+TILESIZE-8)
      }
    })
  }
  renderFarmDetail(mx, my, gx, gy) {
    const x = 540, y = 50
    for (const farm of this.farmList) {
      if (this.player.x == farm.x && this.player.y == farm.y) {
        const stat = farm.stat
        const seedling = stat.seedling
        const seedName = seedling.seed.name
        const remain = seedling.seed.requireTime - seedling.elapsed
        const water = stat.water
        const nutrition = stat.nutrition
        this.ctx.fillStyle = 'rgba(50, 50, 50, 0.7)'
        this.ctx.fillRect(x, y, 240, 120)
        this.ctx.fillStyle = 'white'
        this.ctx.font = '24px sans'
        this.ctx.fillText(`名前: ${seedName}`, x, y)
        this.ctx.fillText(`栄養: ${nutrition}`, x, y+24+5)
        this.ctx.fillText(`水: ${water}`, x, y+(24+5)*2)
        this.ctx.fillText(`残り${remain}歩`, x, y+(24+5)*3)
        break
      }
    }
  }
  renderNpcHpGage(mx, my, gx, gy) {
    this.npcList.map(x => {
      const npc = x.renderable
      this.ctx.fillStyle = 'red'
      this.ctx.fillRect(npc.prop.x+gx, npc.prop.y+gy-4, TILESIZE, 4)
      this.ctx.fillStyle = 'green'
      this.ctx.fillRect(npc.prop.x+gx, npc.prop.y+gy-4, TILESIZE*(x.stat.hp/x.stat.maxhp), 4)
    })
  }
  renderFieldTile(id, x, y) {
    //this.tm1.render(this.ctx, 8*162, x, y, TILESIZE, TILESIZE)
    /*
    switch (id) {
      case 0:
        //this.ctx.fillStyle = "#efefef"
        break
      case 1:
        this.tm2.render(this.ctx, 2, x, y, TILESIZE, TILESIZE)
        break
      default:
        this.ctx.fillStyle = "red"
        break
    }
    */
    if (id > 0) {
      this.tm1.render(this.ctx, id, x, y, TILESIZE, TILESIZE)
    }
    //this.ctx.fillRect(x, y, x+TILESIZE, y+TILESIZE)
  }
  renderField(mx, my, gx, gy) {
    for (let h = 0; h < this.field.length; ++h) {
      for (let y = Math.max(my, 0); y < this.field[h].length; ++y) {
        for (let x = Math.max(mx, 0); x < this.field[h][y].length; ++x) {
          this.renderFieldTile(this.field[h][y][x], x*TILESIZE+gx, y*TILESIZE+gy)
        }
      }
    }
  }
  renderObjects(mx, my, gx, gy) {
    for (let priority of this.renderableList) {
      for (let r of priority) {
        r.renderable.tiles.render(this.ctx, r.renderable.prop.tileId, r.renderable.prop.x+gx, r.renderable.prop.y+gy, TILESIZE, TILESIZE)
      }
    }
  }
  update() {
    //this.syncAM.process()
    if (this.syncAM.empty()) {
      this.syncAM.wait()
      this.lifecycle.next()
    } else this.syncAM.process()
    this.asyncAM.process()
    if (new Date() - this.inventoryTimer > 4000) {
      this.showInventory = false
      this.inventoryTimer = new Date()
    }
    if (this.showInventory && this.inventoryOpacity < 1) {
      this.inventoryOpacity = Math.min(1, this.inventoryOpacity + 0.05)
    } else if (!this.showInventory && this.inventoryOpacity > 0) {
      this.inventoryOpacity = Math.max(0, this.inventoryOpacity - 0.05)
    }

    this.camera.x = -this.player.renderable.prop.x + 400-16
    this.camera.y = -this.player.renderable.prop.y + 300-16
  }
  render() {
    let camera = this.camera.getPosition()
    let mx = Math.floor(-camera.x / TILESIZE)
    let my = Math.floor(-camera.y / TILESIZE)
    let gx = camera.x
    let gy = camera.y
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, 800, 600)
    this.renderField(mx, my, gx, gy)
    this.renderObjects(mx, my, gx, gy)
    if (this.player.stat.holding) {
      let holding = this.player.stat.holding.renderable
      holding.tiles.render(this.ctx, holding.prop.tileId, this.player.renderable.prop.x+gx, this.player.renderable.prop.y+gy-20, TILESIZE, TILESIZE)
    }
    this.renderFarmStat(mx, my, gx, gy)
    this.renderNpcHpGage(mx, my, gx, gy)
    this.renderFarmDetail(mx, my, gx, gy)
    this.renderPlayerInventory(mx, my, gx, gy)
    this.renderInfo(mx, my, gx, gy)
    this.messageWindow.render(this.ctx, 0, 600-this.messageWindow.height)
  }
}
