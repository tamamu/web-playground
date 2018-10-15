
import {KeyboardStore} from "./keyboard"
import {Renderable} from "./renderable"
import {Animatable, Animation, AnimationState, AnimationManager} from "./animation"

const TILESIZE = 32

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

class TileManager {
  constructor(path, width, height) {
    this.base = new Image();
    this.base.src = path;
    this.width = width
    this.height = height
    this.base.onload = () => {
      this.numx = this.base.width / this.width
      this.numy = this.base.height / this.height
      console.log(this.numx, this.numy)
    }
  }
  render(ctx, id, x, y, width, height) {
    const ix = id % this.numx
    const iy = (id - ix) / this.numx
    ctx.drawImage(this.base, ix*this.width, iy*this.height, this.width, this.height, x, y, width, height)
  }
}

class GameObject {
  constructor(renderable, x, y, tileId) {
    this.renderable = renderable
    this._x = x
    this._y = y
    this._tileId = tileId
    this._direction = 'down'
  }
  get x() {
    return this._x
  }
  get y() {
    return this._y
  }
  get tileId() {
    return this._tileId
  }
  get direction() {
    return this._direction
  }
  set x(value) {
    this._x = value
    //this.renderable.prop.x = value * 32
  }
  set y(value) {
    this._y = value
    //this.renderable.prop.y = value * 32
  }
  set direction(value) {
    this._direction = value
    switch (this._direction) {
      case 'down':
        this._tileId = this.renderable.prop.tileId = 1
        break
      case 'left':
        this._tileId = this.renderable.prop.tileId = 4
        break
      case 'right':
        this._tileId = this.renderable.prop.tileId = 7
        break
      case 'up':
        this._tileId = this.renderable.prop.tileId = 10
        break
    }
  }
  set tileId(value) {
    this._tileId = value
    this.renderable.prop.tileId = value
  }
  move(x, y) {
    this._x = x
    this._y = y
    this.renderable.prop.x = this._x * TILESIZE
    this.renderable.prop.y = this._y * TILESIZE
  }
  fix() {
    this.renderable.prop.x = this.x * TILESIZE
    this.renderable.prop.y = this.y * TILESIZE
    this.renderable.prop.tileId = this.tileId
  }
}

class ItemState {
  constructor(name) {
    this.name = name
    this.type = 'none'
  }
}

class SeedState extends ItemState {
  constructor(name, item, growthPeriods, minimumNutrition) {
    super(name)
    this.type = 'seed'
    this.species = item
    this.requireTime = growthPeriods[growthPeriods.length-1]
    this.growthPeriods = growthPeriods
    this.minimumNutrition = minimumNutrition
  }
}

class Item extends GameObject {
  constructor(stat, renderable, x, y, tileId) {
    super(renderable, x, y, tileId)
    this.stat = stat
  }
}

class CharaStatus {
  constructor(name, maxhp, atk, def, luk, isEnemy=false) {
    this.name = name
    this.maxhp = maxhp
    this.hp = maxhp
    this.atk = atk
    this.def = def
    this.luk = luk
    this.itemList = [null, null, null, null, null]
    this.money = 0
    this.holding = null
    this.isEnemy = isEnemy
    this.isDead = false
  }
}

class Character extends GameObject {
  constructor(stat, renderable, x, y, tileId) {
    super(renderable, x, y, tileId)
    this.stat = stat
  }
}

class Seedling {
  constructor(seed) {
    this.seed = seed
    this.nutrition = 0
    this.period = 0
    this.elapsed = 0
  }
}

class FarmState {
  constructor(seedling, nutrition, water) {
    this.seedling = seedling
    this.nutrition = nutrition
    this.water = water
  }
}

class Farm extends GameObject {
  constructor(stat, renderable, x, y) {
    super(renderable, x, y, 100)
    this.stat = stat
  }
}

class MessageWindow {
  constructor(maxlen, fontsize) {
    this.messages = []
    this.maxlen = maxlen
    this.fontSize = fontsize
    this.height = (this.fontSize+4)*this.maxlen
    this.width = 800
  }
  push(mes) {
    this.messages.push(mes)
    while (this.messages.length > this.maxlen) {
      this.messages.shift()
    }
  }
  render(ctx, x, y) {
    ctx.textBaseline = 'top'
    ctx.font = `${this.fontSize}px sans`
    ctx.fillStyle = 'rgba(50, 50, 50, 0.7)';
    ctx.fillRect(x, y, 800, this.height)
    for (let j=0; j < this.messages.length; ++j) {
      ctx.fillStyle = 'white'
      ctx.fillText(this.messages[j], 0, y+this.fontSize*j+4*j)
    }
  }
}

class Camera {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.isFixed = false
    this.fixedX = x
    this.fixedY = y
  }
  getPosition() {
    if (this.isFixed) {
      return {x: this.fixedX, y: this.fixedY}
    } else {
      return {x: this.x, y: this.y}
    }
  }
  fix() {
    this.isFixed = true
    this.fixedX = this.x
    this.fixedY = this.y
  }
  unfix() {
    this.isFixed = false
  }
}

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
    this.messageWindow = new MessageWindow(5, 18)
    this.camera = new Camera()
    document.addEventListener("keydown", this.keyStore.onKeyDown.bind(this.keyStore))
    document.addEventListener("keyup", this.keyStore.onKeyUp.bind(this.keyStore))
    // Tile Manage Test {
      this.tm1 = new TileManager("./resources/base.png", 16, 16)
      this.tm2 = new TileManager("./resources/kabe-ue_doukutu1.png", 16, 16)
      this.tm3 = new TileManager("./resources/pipo-charachip002a.png", 32, 32)
      this.tm4 = new TileManager("./resources/pipo-charachip019c.png", 32, 32)
      this.tm_coin = new TileManager("./resources/icon020.png", 24, 24)
      let tm_seed = new TileManager("./resources/icon021.png", 24, 24)
    // } End Tile Manage Test
    // Animation Test {
      let p = createWalkAnimatable(this.tm3, 1*TILESIZE, 1*TILESIZE, 1)
      let e = createWalkAnimatable(this.tm4, 9*TILESIZE, 1*TILESIZE, 5)
      let c = new Renderable(1*TILESIZE, 4*TILESIZE, this.tm_coin, 0)
      let pStat = new CharaStatus("You", 50, 10, 9, 8)
      let eStat = new CharaStatus("Enemy", 10, 5, 4, 3, true)
      let cStat = new ItemState("Coin")
      this.player = new Character(pStat, p, 1, 1, 1)
      this.enemy = new Character(eStat, e, 9, 1, 5)
      this.coin = new Item(cStat, c, 1, 4, 0)
      let sStat = new SeedState("CoinSeed", this.coin, [5], 3)
      function makeCoinSeed(x, y) {
        let s = new Renderable(x*TILESIZE, y*TILESIZE, tm_seed, 0)
        return new Item(sStat, s, x, y, 0)
      }
      this.dropList.push(this.coin)
      this.dropList.push(makeCoinSeed(10, 10))
      this.dropList.push(makeCoinSeed(8, 7))
      this.dropList.push(makeCoinSeed(12, 5))
      this.dropList.push(makeCoinSeed(16, 1))
      this.dropList.push(makeCoinSeed(1, 5))
      //this.renderableList.push(p)
      //this.renderableList.push(e)
      //this.renderableList.push(c)
      this.playerList.push(this.player)
      this.npcList.push(this.enemy)
    // } End Animation Test

    this.lifecycle = this.genLifeCycle()
  }
  collision(x, y) {
    return this.field[y][x] == 1 || this.detectEnemy(x, y) || (this.player.x == x && this.player.y == y)
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
    let enemy = null
    switch (this.player.direction) {
      case 'down':
        enemy = this.detectEnemy(this.player.x, this.player.y+1)
        break
      case 'left':
        enemy = this.detectEnemy(this.player.x-1, this.player.y)
        break
      case 'right':
        enemy = this.detectEnemy(this.player.x+1, this.player.y)
        break
      case 'up':
        enemy = this.detectEnemy(this.player.x, this.player.y-1)
        break
    }
    let cameraFixed = this.camera.isFixed
    if (!cameraFixed) this.camera.fix()
    this.syncAM.push(new Animation(this.player.renderable, `${this.player.direction}-attack`, () => {
      if (enemy) {
        let damage = Math.max(0, this.calcDamage(this.player.stat.atk, enemy.stat.def))
        this.damage(this.player, enemy, damage)
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
      this.playerInventorySpin()
      return 0
    } else if (keys["k"]) {
      this.playerInventorySpin(true)
    }
    return 0
  }
  playerInventorySpin(backward) {
    let holding = this.player.stat.holding
    let head = null
    if (backward) {
      head = this.player.stat.itemList.pop()
      this.player.stat.itemList.unshift(holding)
    } else {
      head = this.player.stat.itemList.shift()
      this.player.stat.itemList.push(holding)
    }
    if (holding) {
      if (head) {
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
      default:
        this.messageWindow.push(`${this.player.stat.name}は${holding.stat.name}を使おうとしたが、使い方が分からない！`)
        break
    }
    return 2
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
    console.log("npcAction")
    if (Math.random() < 0.3) {
      return this.npcAttack(this.enemy)
    }
    let x = Math.floor(Math.random() * 3 - 1)
    let y = Math.floor(Math.random() * 3 - 1)
    if (y < 0 && !this.collision(this.enemy.x, this.enemy.y+y)) {
      this.enemy.direction = 'up'
      if (x < 0 && !this.collision(this.enemy.x+x, this.enemy.y+y)) {
        this.syncAM.push(new Animation(this.enemy.renderable, "up-left", () => {
          this.enemy.x -= 1
          this.enemy.y -= 1
        }))
      } else if (x > 0 && !this.collision(this.enemy.x+x, this.enemy.y+y)) {
        this.syncAM.push(new Animation(this.enemy.renderable, "up-right", () => {
          this.enemy.x += 1
          this.enemy.y -= 1
        }))
      } else {
        this.syncAM.push(new Animation(this.enemy.renderable, "up", () => {
          this.enemy.y -= 1
        }))
      }
    } else if (y > 0 && !this.collision(this.enemy.x, this.enemy.y+y)) {
      this.enemy.direction = 'down'
      if (x < 0 && !this.collision(this.enemy.x+x, this.enemy.y+y)) {
        this.syncAM.push(new Animation(this.enemy.renderable, "down-left", () => {
          this.enemy.x -= 1
          this.enemy.y += 1
        }))
      } else if (x > 0 && !this.collision(this.enemy.x+x, this.enemy.y+y)) {
        this.syncAM.push(new Animation(this.enemy.renderable, "down-right", () => {
          this.enemy.x += 1
          this.enemy.y += 1
        }))
      } else {
        this.syncAM.push(new Animation(this.enemy.renderable, "down", () => {
          this.enemy.y += 1
        }))
      }
    } else if (x < 0 && !this.collision(this.enemy.x+x, this.enemy.y)) {
      this.enemy.direction = 'left'
      this.syncAM.push(new Animation(this.enemy.renderable, "left", () => {
        this.enemy.x -= 1
      }))
    } else if (x > 0 && !this.collision(this.enemy.x+x, this.enemy.y)) {
      this.enemy.direction = 'right'
      this.syncAM.push(new Animation(this.enemy.renderable, "right", () => {
        this.enemy.x += 1
      }))
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
      this.removeDeadCharas()
      this.npcAction()
      this.checkPlayerFloor()
      checkNpcFloor()
      //yield 5
    }
  }
  renderFarmStat(mx, my, gx, gy) {
    this.farmList.map(x => {
      console.log(x)
      const farm = x.renderable
      const stat = x.stat
      const seedling = stat.seedling
      const remain = seedling.seed.requireTime - seedling.elapsed
      const requireWater = seedling.nutrition == 0 && stat.water == 0
      if (remain == 0) {
        this.ctx.fillStyle = 'yellow'
        this.ctx.font = '10px sans'
        this.ctx.fillText("収穫可能", farm.prop.x+gx, farm.prop.y+gy+TILESIZE-8)
      } else if (requireWater) {
        this.ctx.fillStyle = 'lightblue'
        this.ctx.font = '10px sans'
        this.ctx.fillText("水必要", farm.prop.x+gx, farm.prop.y+gy+TILESIZE-8)
      } else {
        this.ctx.fillStyle = 'lightgreen'
        this.ctx.font = '10px sans'
        this.ctx.fillText(`あと${remain}歩`, farm.prop.x+gx, farm.prop.y+gy+TILESIZE-8)
      }
    })
  }
  renderFarmDetail(mx, my, gx, gy) {
    for (const farm of this.farmList) {
      if (this.player.x == farm.x && this.player.y == farm.y) {
        const stat = farm.stat
        const seedling = stat.seedling
        const seedName = seedling.seed.name
        const remain = seedling.seed.requireTime - seedling.elapsed
        const water = stat.water
        const nutrition = stat.nutrition
        this.ctx.fillStyle = 'rgba(50, 50, 50, 0.7)'
        this.ctx.fillRect(600, 50, 150, 80)
        this.ctx.fillStyle = 'white'
        this.ctx.font = '18px sans'
        this.ctx.fillText(`名前: ${seedName}`, 600, 50)
        this.ctx.fillText(`栄養: ${nutrition}`, 600, 70)
        this.ctx.fillText(`水: ${water}`, 600, 90)
        this.ctx.fillText(`残り${remain}歩`, 600, 110)
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
    this.tm1.render(this.ctx, 8*162, x, y, TILESIZE, TILESIZE)
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
    //this.ctx.fillRect(x, y, x+TILESIZE, y+TILESIZE)
  }
  renderField(mx, my, gx, gy) {
    for (let y = Math.max(my, 0); y < this.field.length; ++y) {
      for (let x = Math.max(mx, 0); x < this.field[y].length; ++x) {
        this.renderFieldTile(this.field[y][x], x*TILESIZE+gx, y*TILESIZE+gy)
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
    this.messageWindow.render(this.ctx, 0, 600-this.messageWindow.height)
  }
}
