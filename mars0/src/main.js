
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
import GameMap from './GameMap'
import GameDate from './GameDate'

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
  ],[
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,87,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,80,0,0,0,0,0,0,0,0,0,0,0,0,104,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,89,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,49,48,49,48,49,48,49,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,73,72,73,72,73,72,65,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,73,72,73,72,73,72,65,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,73,72,73,72,73,72,65,0,0,0,],
    [0,0,85,0,0,0,0,0,0,0,0,0,0,0,93,93,0,0,0,64,73,72,73,72,73,72,65,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,73,72,73,72,73,72,65,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,73,72,73,72,73,72,65,0,0,0,],
    [0,0,0,0,0,0,0,0,95,0,0,0,0,0,0,0,0,0,0,64,73,72,73,72,73,72,65,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,73,72,73,72,73,72,65,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,73,72,73,72,73,72,65,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,65,56,57,56,57,56,57,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,57,0,0,0,0,0,92,0,0,0,]
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
      new AnimationState(TILESIZE, 0, 13, 90),
      new AnimationState(-TILESIZE, 0, 13, 90),
    ],
    "right": [
      new AnimationState(TILESIZE/4, 0, 12, 48),
      new AnimationState(TILESIZE/4, 0, 13, 48),
      new AnimationState(TILESIZE/4, 0, 14, 48),
      new AnimationState(TILESIZE/4, 0, 13, 48),
    ],
    "left-attack": [
      new AnimationState(-TILESIZE, 0, 7, 90),
      new AnimationState(TILESIZE, 0, 7, 90),
    ],
    "left": [
      new AnimationState(-TILESIZE/4, 0, 6, 48),
      new AnimationState(-TILESIZE/4, 0, 7, 48),
      new AnimationState(-TILESIZE/4, 0, 8, 48),
      new AnimationState(-TILESIZE/4, 0, 7, 48),
    ],
    "up-attack": [
      new AnimationState(0, -TILESIZE, 19, 90),
      new AnimationState(0, TILESIZE, 19, 90),
    ],
    "up": [
      new AnimationState(0, -TILESIZE/4, 18, 48),
      new AnimationState(0, -TILESIZE/4, 19, 48),
      new AnimationState(0, -TILESIZE/4, 20, 48),
      new AnimationState(0, -TILESIZE/4, 19, 48),
    ],
    "down-attack": [
      new AnimationState(0, TILESIZE, 1, 90),
      new AnimationState(0, -TILESIZE, 1, 90),
    ],
    "down": [
      new AnimationState(0, TILESIZE/4, 0, 48),
      new AnimationState(0, TILESIZE/4, 1, 48),
      new AnimationState(0, TILESIZE/4, 2, 48),
      new AnimationState(0, TILESIZE/4, 1, 48),
    ],
    "down-right-attack": [
      new AnimationState(TILESIZE, TILESIZE, 10, 90),
      new AnimationState(-TILESIZE, -TILESIZE, 10, 90),
    ],
    "down-right": [
      new AnimationState(TILESIZE/4, TILESIZE/4, 9, 48),
      new AnimationState(TILESIZE/4, TILESIZE/4, 10, 48),
      new AnimationState(TILESIZE/4, TILESIZE/4, 11, 48),
      new AnimationState(TILESIZE/4, TILESIZE/4, 10, 48),
    ],
    "down-left-attack": [
      new AnimationState(-TILESIZE, TILESIZE, 4, 90),
      new AnimationState(TILESIZE, -TILESIZE, 4, 90),
    ],
    "down-left": [
      new AnimationState(-TILESIZE/4, TILESIZE/4, 3, 48),
      new AnimationState(-TILESIZE/4, TILESIZE/4, 4, 48),
      new AnimationState(-TILESIZE/4, TILESIZE/4, 5, 48),
      new AnimationState(-TILESIZE/4, TILESIZE/4, 4, 48),
    ],
    "up-right-attack": [
      new AnimationState(TILESIZE, -TILESIZE, 22, 90),
      new AnimationState(-TILESIZE, TILESIZE, 22, 90),
    ],
    "up-right": [
      new AnimationState(TILESIZE/4, -TILESIZE/4, 21, 48),
      new AnimationState(TILESIZE/4, -TILESIZE/4, 22, 48),
      new AnimationState(TILESIZE/4, -TILESIZE/4, 23, 48),
      new AnimationState(TILESIZE/4, -TILESIZE/4, 22, 48),
    ],
    "up-left-attack": [
      new AnimationState(-TILESIZE, -TILESIZE, 16, 90),
      new AnimationState(TILESIZE, TILESIZE, 16, 90),
    ],
    "up-left": [
      new AnimationState(-TILESIZE/4, -TILESIZE/4, 15, 48),
      new AnimationState(-TILESIZE/4, -TILESIZE/4, 16, 48),
      new AnimationState(-TILESIZE/4, -TILESIZE/4, 17, 48),
      new AnimationState(-TILESIZE/4, -TILESIZE/4, 16, 48),
    ],
  })
}

class DamageEffect {
  constructor(target, damage) {
    this.target = target
    this.damage = damage
    this.timer = new Date()
  }
  update() {
    if (new Date() - this.timer > 1000) {
      this.end = true
    }
  }
}


class Sound {
  constructor(path) {
    this.path = path
    this.audio = new Audio()
    //this.audio.preload = 'none'
    this.audio.src = path
    this.audio.autoplay = false
    this.audio.load()
  }
  play(loop = false) {
    let a = new Audio()
    a.src = this.path
    a.loop = loop
    return a.play()
  }
}

function drawWindow(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.fillRect(x, y, w, h)
  ctx.strokeStyle = 'white'
  ctx.strokeRect(x, y, w, h)
}

class ProduceWindow {
  constructor(keystore, inventory) {
    this.keyStore = keystore
    this.matchedRecipes = []
    this.usingItems = []
    this.inventory = inventory
    this.selectContent = 0
    this.cursor = 0
    this.closed = false
  }
  input() {
    const keys = this.keyStore.get()
    if (keys['ArrowUp']) {
      this.selectContent = this.selectContent == 0 ? 1 : 0;
    } else if (keys['ArrowDown']) {
      this.selectContent = this.selectContent == 1 ? 0 : 1;
    }
    if (keys['ArrowLeft']) {
      this.cursor = this.cursor == 0 ? this.inventory.length-1 : this.cursor-1
    } else if (keys['ArrowRight']) {
      this.cursor = this.cursor == this.inventory.length-1 ? 0 : this.cursor+1
    }
    if (keys['Escape']) {
      this.closed = true
      return 0
    }
    return 1
  }
  *genLifeCycle() {
    while(true) {
      while(this.input() == 1) {
        yield 1
      }
      if (this.closed) {
        break
      }
    }
    return 0
  }
  render(ctx) {
    const w = TILESIZE*this.inventory.length
    drawWindow(ctx, 250, 40, 300, 240)
    drawWindow(ctx, 400-w/2, 292, w, TILESIZE)
    drawWindow(ctx, 400-w/2, 352, w, TILESIZE)
    for (let j=0; j < this.inventory.length; ++j) {
      const item = this.inventory[j]
      if (item) {
        item.renderable.tiles.render(ctx, item.tileId, TILESIZE * j + 400-w/2, 352, TILESIZE, TILESIZE)
      }
    }
    ctx.strokeStyle = 'blue'
    const x = this.cursor * TILESIZE + 400-w/2
    const y = this.selectContent == 0 ? 352 : 292
    ctx.strokeRect(x, y, TILESIZE, TILESIZE)
  }
}

export default class MarsZero {
  constructor(ctx) {
    this.ctx = ctx
    this.field = testMap
    this.syncAM = new AnimationManager()
    this.asyncAM = new AnimationManager()
    let farmList = []
    let dropList = []
    let playerList = []
    let npcList = []
    let holdingList = []
    this.keyStore = new KeyboardStore()
    this.messageWindow = new MessageWindow(4, 20)
    this.camera = new Camera()
    this.inventoryTimer = new Date()
    this.blinkTimer = new Date()
    this.showInventory = false
    this.inventoryOpacity = 0
    this.date = new GameDate()
    this.date.elapseMinute(720)
    this.tm1 = new TileManager("./resources/base.png", 16, 16)
    this.ignoreLastInput = false
    this.damageList = []
    this.upperWindow = null
    document.addEventListener("keydown", this.keyStore.onKeyDown.bind(this.keyStore))
    document.addEventListener("keyup", this.keyStore.onKeyUp.bind(this.keyStore))
    // Sound Test {
      this.bgm = new Sound("./resources/Elven-Sanctuary_loop.ogg")
      this.snd_hit = new Sound("./resources/se_maoudamashii_battle16.wav")
      this.snd_swd = new Sound("./resources/se_maoudamashii_battle17.wav")
      this.snd_eatk = new Sound("./resources/se_maoudamashii_battle03.wav")
      this.snd_spr = new Sound("./resources/se_maoudamashii_battle14.wav")
      this.snd_equip = new Sound("./resources/soubi-01.wav")
    // }
    // Tile Manage Test {
      this.tm2 = new TileManager("./resources/kabe-ue_doukutu1.png", 16, 16)
      this.tm3 = new TileManager("./resources/02_town2.png", 24, 40)
      let tm4 = new TileManager("./resources/10_village5.png", 24, 40)
      this.tm_coin = new TileManager("./resources/icon020.png", 24, 24)
      this.tm_apple = new TileManager("./resources/icon028.png", 24, 24)
      this.tm_sword = new TileManager("./resources/icon002.png", 24, 24)
      this.tm_spear = new TileManager("./resources/icon004.png", 24, 24)
      this.tm_hammer = new TileManager("./resources/icon003.png", 24, 24)
      this.tm_pot = new TileManager("./resources/icon030.png", 24, 24)
      let tm_seed = new TileManager("./resources/icon021.png", 24, 24)
    // } End Tile Manage Test
    // Animation Test {
      let p = createWalkAnimatable(this.tm3, 1*TILESIZE, 1*TILESIZE, 1)
      let c = new Renderable(1*TILESIZE, 4*TILESIZE, this.tm_coin, 0)
      let a = new Renderable(9*TILESIZE, 8*TILESIZE, this.tm_apple, 0)
      let sw = new Renderable(10*TILESIZE, 4*TILESIZE, this.tm_sword, 0)
      let sp = new Renderable(10*TILESIZE, 5*TILESIZE, this.tm_spear, 0)
      let ha = new Renderable(10*TILESIZE, 6*TILESIZE, this.tm_hammer, 0)
      let po = new Renderable(3*TILESIZE, 2*TILESIZE, this.tm_pot, 0)
      let pStat = new CharaStatus("You", 50, 10, 9, 8)
      let cStat = new ItemState("コイン")
      let aStat = new FoodState("りんご", 300)
      let swStat = new WeaponState("テストソード", 'sword', 30, 0.1)
      let spStat = new WeaponState("テストスピア", 'spear', 20, 0.1)
      let haStat = new WeaponState("テストハンマー", 'hammer', 20, 0.1)
      let poStat = new WeaponState("テストじょうろ", 'watering', 5, 0.1)
      poStat.isStable = true
      poStat.water = 720*3
      function makeEnemy(x, y) {
        let e = createWalkAnimatable(tm4, x*TILESIZE, y*TILESIZE, 5)
        return new Character(new CharaStatus("テストさん", 30, 10, 10, 10, 3, true), e, x, y)
      }
      this.player = new Character(pStat, p, 1, 1, 1)
      this.coin = new Item(cStat, c, 1, 4, 0)
      this.apple = new Item(aStat, a, 9, 8, 0)
      this.sword = new Item(swStat, sw, 10, 4, 0)
      this.spear = new Item(spStat, sp, 10, 5, 0)
      this.hammer = new Item(haStat, ha, 10, 6, 0)
      this.pot = new Item(poStat, po, 3, 2, 0)
      let sStat = new SeedState("コインの種", this.coin, [5], 3)
      let swsStat = new SeedState("テストソードの種", this.sword, [10], 3)
      function makeSeed(stat, x, y) {
        let s = new Renderable(x*TILESIZE, y*TILESIZE, tm_seed, 0)
        return new Item(stat, s, x, y, 0)
      }
      dropList.push(this.coin)
      dropList.push(this.apple)
      dropList.push(this.sword)
      dropList.push(this.spear)
      dropList.push(this.hammer)
      dropList.push(this.pot)
      dropList.push(makeSeed(sStat, 10, 10))
      dropList.push(makeSeed(sStat, 8, 7))
      dropList.push(makeSeed(sStat, 12, 5))
      dropList.push(makeSeed(sStat, 16, 1))
      dropList.push(makeSeed(sStat, 1, 5))
      dropList.push(makeSeed(swsStat, 5, 5))
      //renderableList.push(p)
      //renderableList.push(e)
      //renderableList.push(c)
      playerList.push(this.player)
      npcList.push(makeEnemy(3, 3))
      npcList.push(makeEnemy(3, 4))
      npcList.push(makeEnemy(4, 3))
      npcList.push(makeEnemy(4, 4))
      npcList.push(makeEnemy(4, 5))
      npcList.push(makeEnemy(5, 4))
    // } End Animation Test

    this.gameMap = new GameMap(this.tm1, this.player, testMap[0], testMap[1], testMap[2], null, dropList, farmList, npcList)
    this.lifecycle = this.genLifeCycle()
  }
  damage(from, to, damage) {
    this.damageList.push(new DamageEffect(to, damage))
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
    let x = 0, y = 0
    switch (this.player.direction) {
      case 'down': x = 0, y = 1; break
      case 'down-left': x = -1, y = 1; break
      case 'down-right': x = 1, y = 1; break
      case 'left': x = -1, y = 0; break
      case 'right': x = 1, y = 0; break
      case 'up': x = 0, y = -1; break
      case 'up-left': x = -1, y = -1; break
      case 'up-right': x = 1, y = -1; break
    }
    attackRange.push([this.player.x+x, this.player.y+y, 1])

    if (weapon) {
      switch (weapon.stat.weaponType) {
        case 'spear':
          if (!this.gameMap.collisionWall(this.player.x+x*2, this.player.y+y*2)) {
            attackRange.push([this.player.x+x*2, this.player.y+y*2, 0.6])
          }
          break
        case 'hammer':
          if (!this.gameMap.collisionWall(this.player.x+x-1, this.player.y+y)) {
            attackRange.push([this.player.x+x-1, this.player.y+y, 0.2])
          }
          if (!this.gameMap.collisionWall(this.player.x+x+1, this.player.y+y)) {
            attackRange.push([this.player.x+x+1, this.player.y+y, 0.2])
          }
          if (!this.gameMap.collisionWall(this.player.x+x, this.player.y+y-1)) {
            attackRange.push([this.player.x+x, this.player.y+y-1, 0.2])
          }
          if (!this.gameMap.collisionWall(this.player.x+x, this.player.y+y+1)) {
            attackRange.push([this.player.x+x, this.player.y+y+1, 0.2])
          }
          break
        default:
      }
    }
    attackRange.map(p => {
      let e = this.gameMap.detectChara(p[0], p[1], true)
      if (e) enemies.push({target: e, mag: p[2]})
    })
    let cameraFixed = this.camera.isFixed
    if (!cameraFixed) this.camera.fix()

    if (enemies.length > 0) {
      this.snd_eatk.play()
    }
    this.syncAM.push(new Animation(this.player.renderable, `${this.player.direction}-attack`, () => {
      if (enemies.length > 0) {
        /*
          if (weapon) {
            switch (weapon.stat.weaponType) {
              case 'sword':
                this.snd_swd.play()
                break
              case 'spear':
                this.snd_spr.play()
                break
              default:
                this.snd_hit.play()
                break
            }
          } else {
            this.snd_hit.play()
          }
          */
          enemies.map(e => {
          let w = 0
          if (weapon) {
            w = weapon.stat.atk
            if (weapon.stat.isSoiled) {
              w /= 2
            }
            if (!weapon.stat.isStable) {
              w -= Math.random() * w
            }
          }
          let damage = Math.max(0, this.calcDamage((this.player.stat.atk + w)*e.mag, e.target.stat.def))
          this.damage(this.player, e.target, damage)
          if (e.target.stat.isDead) {
            this.player.stat.exp += e.target.stat.exp
          }
        })
        if (weapon && !weapon.isStable && Math.random() < weapon.stat.stableRate) {
          weapon.stat.isStable = true
          this.messageWindow.push(`${weapon.stat.screenName}は安定した。`)
        }
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
        enemy = (npc.x==this.player.x && npc.y+1==this.player.y) ? this.player : this.gameMap.detectChara(npc.x, npc.y+1, true)
        break
      case 'left':
        enemy = (npc.x-1==this.player.x && npc.y==this.player.y) ? this.player : this.gameMap.detectChara(npc.x-1, npc.y, true)
        break
      case 'right':
        enemy = (npc.x+1==this.player.x && npc.y==this.player.y) ? this.player : this.gameMap.detectChara(npc.x+1, npc.y, true)
        break
      case 'up':
        enemy = (npc.x==this.player.x && npc.y-1==this.player.y) ? this.player : this.gameMap.detectChara(npc.x, npc.y-1, true)
        break
    }
    if (enemy) {
      this.snd_eatk.play()
    }
    this.syncAM.push(new Animation(npc.renderable, `${npc.direction}-attack`, () => {
      if (enemy) {
        let damage = Math.max(0, this.calcDamage(npc.stat.atk, enemy.stat.def))
        this.damage(npc, enemy, damage)
      }
    }))
  }
  toDirection(x, y) {
    if (x == -1 && y == -1) return 'up-left'
    if (x == -1 && y ==  0) return 'left'
    if (x == -1 && y ==  1) return 'down-left'
    if (x ==  0 && y == -1) return 'up'
    if (x ==  0 && y ==  1) return 'down'
    if (x ==  1 && y == -1) return 'up-right'
    if (x ==  1 && y ==  0) return 'right'
    if (x ==  1 && y ==  1) return 'down-right'
    return 'down'
  }
  playerAction() {
    let keys = this.keyStore.get()
    let x = keys["ArrowLeft"] ? -1 : keys["ArrowRight"] ? 1 : 0
    let y = keys["ArrowUp"] ? -1 : keys["ArrowDown"] ? 1 : 0
    let direction = this.toDirection(x, y)
    if (x != 0 || y != 0) {
      if (new Date() -this.keyStore.lastDown < 100) {
        this.player.direction = direction
        return 0
      }
    }
    this.keyStore.omit()
      console.log(this.player.x, this.player.y)
    if (x != 0 || y != 0) {
      if (this.gameMap.collision(this.player.x+x, this.player.y+y) || keys["Alt"]) {
        this.player.direction = direction
        return 0
      } else {
        this.player.x += x
        this.player.y += y
        this.player.direction = direction
        this.syncAM.push(new Animation(this.player.renderable, direction))
        return 1
      }
    }
    if (keys["Shift"]) {
      this.playerPickUp()
      //return true
      return 0
    } else if (keys[" "]) {
      if (this.player.stat.holding && this.player.stat.holding.stat.type != 'weapon') {
        return this.playerUseHolding()
      } else {
        let enemy = null
        let x = 0, y = 0
        switch (this.player.direction) {
          case 'down': x = 0, y = 1; break
          case 'down-left': x = -1, y = 1; break
          case 'down-right': x = 1, y = 1; break
          case 'left': x = -1, y = 0; break
          case 'right': x = 1, y = 0; break
          case 'up': x = 0, y = -1; break
          case 'up-left': x = -1, y = -1; break
          case 'up-right': x = 1, y = -1; break
        }
        enemy = this.gameMap.detectChara(this.player.x+x, this.player.y+y, true)
        if (this.player.stat.holding && this.player.stat.holding.stat.type == 'weapon' && this.player.stat.holding.stat.weaponType == 'watering' && !enemy) {
          return this.playerUseHolding()
        } else {
          return this.playerAttack()
        }
      }
    } else if (keys["j"]) {
      this.playerInventorySpin(true)
      return 0
    } else if (keys["k"]) {
      this.playerInventorySpin()
    } else if (keys["Escape"]) {
      this.upperWindow = new ProduceWindow(this.keyStore, this.player.stat.itemList)
      this.upperWindowLifeCycle = this.upperWindow.genLifeCycle()
      return 2
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
    if (holding != null) {
      if (head != null) {
        this.messageWindow.push(`${this.player.stat.name}は${holding.stat.screenName}をカバンにしまい、${head.stat.name}を取り出した。`)
      } else {
        this.messageWindow.push(`${this.player.stat.name}は${holding.stat.screenName}をカバンにしまった。`)
      }
    } else {
      if (head) {
        this.messageWindow.push(`${this.player.stat.name}は${head.stat.screenName}を取り出した。`)
      }
    }
    this.player.stat.holding = head
    if (this.player.stat.holding && this.player.stat.holding.stat.weaponType) {
      this.snd_equip.play()
    }
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
        if (holding.stat.weaponType == 'watering') {
          this.playerWater()
        } else {
          this.playerAttack()
        }
        break
      default:
        this.messageWindow.push(`${this.player.stat.name}は${holding.stat.screenName}を使おうとしたが、使い方が分からない！`)
        break
    }
    return 2
  }
  playerWater() {
    const pot = this.player.stat.holding
    if (pot.stat.water <= 0) {
      this.messageWindow.push(`${pot.stat.screenName}に水が入っていない！`)
      return
    }
    let target = null
    let x = 0, y = 0
    switch (this.player.direction) {
      case 'down': x = 0, y = 1; break
      case 'down-left': x = -1, y = 1; break
      case 'down-right': x = 1, y = 1; break
      case 'left': x = -1, y = 0; break
      case 'right': x = 1, y = 0; break
      case 'up': x = 0, y = -1; break
      case 'up-left': x = -1, y = -1; break
      case 'up-right': x = 1, y = -1; break
    }
    target = this.gameMap.detectFarm(this.player.x+x, this.player.y+y)
    if (!target) {
      this.messageWindow.push('そこには何もない。')
      return
    }
    let w = Math.min(pot.stat.water, 720)
    target.stat.water += w
    pot.stat.water -= w
    this.messageWindow.push(`畑に水をやった。`)
  }
  playerEat() {
    const holding = this.player.stat.holding
    this.player.stat.satiety += holding.stat.satiety
    this.messageWindow.push(`${this.player.stat.name}は${holding.stat.screenName}を食べた。`)
    this.messageWindow.push(`お腹が膨れた。`)
    this.player.stat.holding = null
  }
  playerPlant() {
    const holding = this.player.stat.holding
    let farm = new Farm(
      new FarmState(new Seedling(holding.stat), 5, 0),
      new Renderable(this.player.x*TILESIZE, this.player.y*TILESIZE, this.tm1, 100),
      this.player.x,
      this.player.y
    )
    this.messageWindow.push(`${this.player.stat.name}は${holding.stat.screenName}を地面に植えた。`)
    this.gameMap.farmList.push(farm)
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
      let stat
      switch (seed.species.stat.type) {
        case 'none':
          stat = new ItemState(seed.species.stat.name)
          break
        case 'food':
          stat = new FoodState(seed.species.stat.name, seed.species.stat.satiety)
          break
        case 'weapon':
          stat = new WeaponState(seed.species.stat.name, seed.species.stat.weaponType, seed.species.stat.atk)
          break
        case 'seed':
          stat = new SeedState(seed.species.stat.name, seed.species.stat.species, seed.species.stat.growthPeriods, seed.species.stat.minimumNutrition)
          break
        default:
          break
      }
      let item = new Item(stat, renderable, farm.x, farm.y, renderable.prop.tileId)
      item.stat.isSoiled = true
      return item
    }
    return null
  }
  playerPickUp() {
    this.showInventory = true
    this.inventoryTimer = new Date()
    let target = null
    for (let j = 0; j < this.gameMap.farmList.length; ++j) {
      if (this.player.x == this.gameMap.farmList[j].x && this.player.y == this.gameMap.farmList[j].y) {
        target = this.harvest(this.gameMap.farmList[j])
        if (target) {
          this.gameMap.farmList.splice(j, 1)
          break
        }
      }
    }
    for (let j = 0; j < this.gameMap.dropList.length; ++j) {
      if (this.player.x == this.gameMap.dropList[j].x && this.player.y == this.gameMap.dropList[j].y) {
        target = this.gameMap.dropList[j]
        this.gameMap.dropList.splice(j, 1)
        break
      }
    }
    if (target) {
      if (target.stat.weaponType) {
        this.snd_equip.play()
      }
      if (this.player.stat.holding) {
        let holding = this.player.stat.holding
        holding.move(this.player.x, this.player.y)
        this.player.stat.holding = target
        this.gameMap.dropList.push(holding)
        this.messageWindow.push(`${target.stat.screenName}と床に落ちている${holding.stat.screenName}を交換した。`)
      } else {
        this.player.stat.holding = target
        this.messageWindow.push(`${target.stat.screenName}を拾った。`)
      }
    } else {
      if (this.player.stat.holding) {
        let holding = this.player.stat.holding
        holding.move(this.player.x, this.player.y)
        this.gameMap.dropList.push(holding)
        this.player.stat.holding = null
        this.messageWindow.push(`${holding.stat.screenName}を足元に置いた。`)
      } else {
        this.messageWindow.push("そこには何もない。")
      }
    }
  }
  npcAction() {
    for (let npc of this.gameMap.charaList) {
      if (Math.random() < 0.3) {
        return this.npcAttack(npc)
      }
      let x = Math.floor(Math.random() * 3 - 1)
      let y = Math.floor(Math.random() * 3 - 1)
      let direction = this.toDirection(x, y)
      if (this.gameMap.collision(npc.x+x, npc.y+y) || (this.player.x == npc.x+x && this.player.y == npc.y+y)) {
        npc.direction = direction
        continue
      } else if (x != 0 || y != 0) {
        npc.x += x
        npc.y += y
        npc.direction = direction
        this.syncAM.push(new Animation(npc.renderable, direction))
      }
    }
  }
  checkPlayerFloor() {
    for (let item of this.gameMap.dropList) {
      if (this.player.x == item.x && this.player.y == item.y) {
        this.messageWindow.push(`${item.stat.screenName}が床に落ちている。`)
      }
    }
    for (let farm of this.gameMap.farmList) {
      if (this.player.x == farm.x && this.player.y == farm.y) {
        this.messageWindow.push(`${farm.stat.seedling.seed.name}の畑がある。`)
      }
    }
  }
  checkGrowth() {
    for (let farm of this.gameMap.farmList) {
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
  playerLevelUp() {
    this.player.stat.lv += 1
    this.messageWindow.push(`${this.player.stat.name}はLv.${this.player.stat.lv}になった！`)
    const hp = 10
    const atk = Math.ceil(Math.random()*3+1)
    const def = Math.ceil(Math.random()*3+1)
    this.messageWindow.push(`${this.player.stat.name}のHPが${hp}増えた！ATKが${atk}増えた！DEFが${def}増えた！ `)
    this.player.stat.maxhp += hp
    this.player.stat.atk += atk
    this.player.stat.def += def
  }
  updatePlayerStatus() {
    if (this.player.stat.exp >= this.player.stat.maxexp) {
      this.player.stat.exp = 0
      this.player.stat.maxexp += this.player.stat.maxexp
      this.playerLevelUp()
    }
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
    while(!this.bgm.play()) {
      yield 1
    }
    while(true) {
      this.date.elapseMinute(5)
      checkEvent()
      //yield 1
      this.checkGrowth()
      if (this.ignoreLastInput) yield 2
      PlayerTurn: while (true) {
        switch (this.playerAction()) {
          case 0:
            this.ignoreLastInput = true
            yield 3
            break
          case 1:
            this.ignoreLastInput = false
            break PlayerTurn
          case 2:
            if (this.upperWindow) {
              while(true) {
                if (this.upperWindowLifeCycle.next()) {
                  yield 4
                } else {
                  break
                }
              }
              this.upperWindow = null
            }
            this.ignoreLastInput = false
            yield 3
            break PlayerTurn
        }
      }
      this.updatePlayerStatus()
      //this.removeDeadCharas()
      this.npcAction()
      this.checkPlayerFloor()
      checkNpcFloor()
      yield 5
    }
  }
  renderInfo(mx, my, gx, gy) {
    const stat = this.player.stat
    const lv = stat.lv
    const hp = stat.hp
    const maxhp = stat.maxhp
    const money = stat.money
    const exp = stat.exp
    const maxexp = stat.maxexp
    const satiety = Math.ceil((stat.satiety / stat.maxSatiety) * 100)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    this.ctx.fillRect(12, 12, 260, 72)
    this.ctx.strokeStyle = 'white'
    this.ctx.strokeRect(12, 12, 260, 72)
    this.ctx.globalAlpha = 0.3
    this.player.renderable.tiles.render(this.ctx, 1, 12, 16, 64, 64)
    const tw = this.player.renderable.tiles.width
    const th = this.player.renderable.tiles.height
    const rw = tw * 64/th
    const satietyCh = Math.max(0, Math.ceil(th * (stat.satiety / stat.maxSatiety)))
    const satietyRh = Math.max(0, Math.ceil(64 * (stat.satiety / stat.maxSatiety)))
    this.ctx.globalAlpha = 1
    this.player.renderable.tiles.copy(this.ctx, 1, 0, th-satietyCh, tw, satietyCh, 12+32-rw/2, 16+64-satietyRh, rw, satietyRh)
    this.ctx.fillStyle = 'green'
    this.ctx.fillRect(140, 32, (hp/maxhp) * 120, 12)
    this.ctx.fillStyle = 'orange'
    this.ctx.fillRect(140, 46, (exp/maxexp) * 120, 2)
    this.ctx.font = "400 20px 'M PLUS Rounded 1c'"
    //this.ctx.font = "400 20px 'Sawarabi Gothic'"
    this.ctx.fillStyle = 'white'
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
    this.ctx.lineJoin = 'round'
    this.ctx.lineWidth = 1
    this.ctx.fillText(`Lv.${lv}`, 78, 20)
    //this.ctx.fillText(`Lv 1`, 120, 12)
    this.ctx.fillText('HP', 140, 20)
    //this.ctx.strokeText('HP', 80, 32)
    //this.ctx.fillText(`${satiety}%`, 560, 12)
    this.ctx.textAlign = 'right'
    //this.ctx.strokeText(`${satiety}%`, 66, 54)
    this.ctx.fillText(`${hp}/${maxhp}`, 260, 20)
    //this.ctx.strokeText(`${hp}/${maxhp}`, 230, 32)
    this.ctx.fillText('1F / テスト広場', 780, 20)
    this.ctx.font = "400 18px 'M PLUS Rounded 1c'"
    this.ctx.fillText(`${satiety}%`, 66, 54)
    //this.ctx.strokeText('1F / テスト広場', 780, 32)
    //this.ctx.fillText(`${money}G`, 768, 12)
    this.ctx.textAlign = 'start'
  }
  renderPlayerInventory(mx, my, gx, gy) {
    const inventory = this.player.stat.itemList
    const x = 460, y = 412
    this.ctx.globalAlpha = this.inventoryOpacity
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
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
    this.ctx.font = "400 12px 'M PLUS Rounded 1c'"
    this.ctx.fillText('HOLD', x+TILESIZE*inventory.length, y-14)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    this.ctx.fillRect(x+TILESIZE*inventory.length, y, TILESIZE, TILESIZE)
    if (this.player.stat.holding) {
      this.player.stat.holding.renderable.tiles.render(this.ctx, this.player.stat.holding.renderable.prop.tileId, x+TILESIZE*inventory.length, y, TILESIZE, TILESIZE)
    }
    this.ctx.strokeStyle = 'white'
    this.ctx.strokeRect(x+TILESIZE*inventory.length, y, TILESIZE, TILESIZE)
  }
  renderFarmStat(mx, my, gx, gy) {
    this.ctx.font = `400 ${TILESIZE/4}px 'M PLUS Rounded 1c'`
    this.ctx.globalAlpha = 0.8
    this.gameMap.farmList.map(x => {
      const farm = x.renderable
      const stat = x.stat
      const seedling = stat.seedling
      const remain = seedling.seed.requireTime - seedling.elapsed
      const requireWater = seedling.nutrition == 0 && stat.water == 0
      if (remain <= 0) {
        this.ctx.fillStyle = 'yellow'
        this.ctx.fillText("収穫可能", farm.prop.x+gx, farm.prop.y+gy+TILESIZE-8)
      } else if (requireWater) {
        this.ctx.fillStyle = 'lightblue'
        this.ctx.fillText("水必要", farm.prop.x+gx, farm.prop.y+gy+TILESIZE-8)
      } else {
        this.ctx.fillStyle = 'lightgreen'
        this.ctx.fillText(`あと${remain}分`, farm.prop.x+gx, farm.prop.y+gy+TILESIZE-8)
      }
    })
    this.ctx.globalAlpha = 1
  }
  renderFarmDetail(mx, my, gx, gy) {
    const x = 12, y = 360
    for (const farm of this.gameMap.farmList) {
      if (this.player.x == farm.x && this.player.y == farm.y) {
        const stat = farm.stat
        const seedling = stat.seedling
        const seedName = seedling.seed.name
        const remain = seedling.seed.requireTime - seedling.elapsed
        const water = stat.water
        const nutrition = stat.nutrition
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        this.ctx.fillRect(x, y, 240, 84)
        this.ctx.strokeStyle = 'white'
        this.ctx.strokeRect(x, y, 240, 84)
        this.ctx.fillStyle = 'white'
        this.ctx.font = "400 16px 'M PLUS Rounded 1c'"
        this.ctx.fillText(`名前: ${seedName}`, x, y)
        this.ctx.fillText(`栄養: ${nutrition}`, x, y+16+4)
        this.ctx.fillText(`水: ${water}`, x, y+(16+4)*2)
        this.ctx.fillText(remain > 0 ? `残り${remain}分` : '収穫可能', x, y+(16+4)*3)
        break
      }
    }
  }
  renderNpcHpGage(mx, my, gx, gy) {
    this.gameMap.charaList.map(x => {
      const npc = x.renderable
      this.ctx.fillStyle = 'red'
      this.ctx.fillRect(npc.prop.x+gx, npc.prop.y+gy-4, TILESIZE, 4)
      this.ctx.fillStyle = 'green'
      this.ctx.fillRect(npc.prop.x+gx, npc.prop.y+gy-4, TILESIZE*(x.stat.hp/x.stat.maxhp), 4)
    })
  }
  renderDamageEffect(mx, my, gx, gy) {
    this.damageList.map(x => {
      const target = x.target
      const d = new Date() - x.timer
      const dx = 12* 4e-7 * -(d-500)*(d-500)
      const dy = Math.sin(d/30) * (12-d/100)
      this.ctx.font = "20px 'M PLUS Rounded 1c'"
      this.ctx.globalAlpha = Math.max(0, (1-(d*d / 1000000)))
      this.ctx.fillStyle = 'white'
      this.ctx.fillText(`${x.damage}`, target.renderable.prop.x+gx+20+dx, target.renderable.prop.y+gy+24+dy)
    })
  }
  renderHoldingRange(mx, my, gx, gy) {
    const holding = this.player.stat.holding
    let x = 0, y = 0
    switch (this.player.direction) {
      case 'down': x = 0, y = 1; break
      case 'down-left': x = -1, y = 1; break
      case 'down-right': x = 1, y = 1; break
      case 'left': x = -1, y = 0; break
      case 'right': x = 1, y = 0; break
      case 'up': x = 0, y = -1; break
      case 'up-left': x = -1, y = -1; break
      case 'up-right': x = 1, y = -1; break
    }
    let range = []
    if (!holding) {
      range.push([this.player.x+x, this.player.y+y])
    } else {
      let weapon = null
      if (holding.stat.type == 'weapon') {
        range.push([this.player.x+x, this.player.y+y])
        switch (holding.stat.weaponType) {
          case 'spear':
            if (!this.gameMap.collisionWall(this.player.x+x*2, this.player.y+y*2)) {
              range.push([this.player.x+x*2, this.player.y+y*2])
            }
            break
          case 'hammer':
            if (!this.gameMap.collisionWall(this.player.x+x-1, this.player.y+y) && (x-1 != 0)) {
              range.push([this.player.x+x-1, this.player.y+y])
            }
            if (!this.gameMap.collisionWall(this.player.x+x+1, this.player.y+y) && (x+1 != 0)) {
              range.push([this.player.x+x+1, this.player.y+y])
            }
            if (!this.gameMap.collisionWall(this.player.x+x, this.player.y+y-1) && (y-1 != 0)) {
              range.push([this.player.x+x, this.player.y+y-1])
            }
            if (!this.gameMap.collisionWall(this.player.x+x, this.player.y+y+1) && (y+1 != 0)) {
              range.push([this.player.x+x, this.player.y+y+1])
            }
            break
          default:
        }
      }
    }
    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)'
    range.map(p => {
      this.ctx.strokeRect(p[0]*TILESIZE+gx, p[1]*TILESIZE+gy, TILESIZE, TILESIZE)
    })
  }
  update() {
    //this.syncAM.process()
    if (this.syncAM.empty()) {
      this.syncAM.wait()
      this.lifecycle.next()
    } else this.syncAM.process()
    this.asyncAM.process()

    this.damageList.map(x => x.update())
    this.damageList = this.damageList.filter(x => !x.end)
    this.gameMap.update()
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
    //this.renderField(mx, my, gx, gy)
    //this.renderObjects(mx, my, gx, gy)
    this.gameMap.render(this.ctx, mx, my, gx, gy)
    this.renderHoldingRange(mx, my, gx, gy)
    if (this.player.stat.holding) {
      let holding = this.player.stat.holding.renderable
      holding.tiles.render(this.ctx, holding.prop.tileId, this.player.renderable.prop.x+gx+4, this.player.renderable.prop.y+gy-20, TILESIZE*0.8, TILESIZE*0.8)
    }
    this.renderNpcHpGage(mx, my, gx, gy)
    this.renderDamageEffect(mx, my, gx, gy)
    this.date.renderPeriodFilter(this.ctx, 800, 600)
    this.renderFarmStat(mx, my, gx, gy)
    this.renderFarmDetail(mx, my, gx, gy)
    this.renderPlayerInventory(mx, my, gx, gy)
    this.renderInfo(mx, my, gx, gy)
    this.messageWindow.render(this.ctx, 0, 600-this.messageWindow.height)
    this.date.render(this.ctx, 78, 50)
    if (this.upperWindow) {
      this.upperWindow.render(this.ctx)
    }
  }
}
