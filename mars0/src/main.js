
import {KeyboardStore} from "./keyboard"
import {Renderable} from "./renderable"
import {Animatable, Animation, AnimationState, AnimationManager} from "./animation"
import {createWalkAnimatable} from './Walker'
import GameObject from './GameObject'
import TileManager from './TileManager'
import {TILESIZE} from './constants'
import MessageWindow from './MessageWindow'
import ProduceWindow from './ProduceWindow'
import SelectWindow from './SelectWindow'
import Camera from './Camera'
import {CharaStatus, Character} from './Character'
import {Seedling, FarmState, Farm} from './Farm'
import FoodState from './Food'
import {ItemState, Item} from './Item'
import SeedState from './Seed'
import WeaponState from './Weapon'
import GameMap from './GameMap'
import GameDate from './GameDate'
import Dungeon from './Dungeon'
import {FloorProperty, FloorObject} from './FloorObject'
import {TileDictionary, ItemDictionary, CharaDictionary} from './DataLoader'
import ItemJSON from './item.json'
import EnemyJSON from './enemy.json'

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

export default class MarsZero {
  constructor(ctx, keys=null) {
    this.ctx = ctx
    this.syncAM = new AnimationManager()
    this.asyncAM = new AnimationManager()
    this.tileDict = new TileDictionary('./resources/')
    this.tileDict.register('02_town2.png', 24, 40)
    this.tileDict.register('10_village5.png', 24, 40)
    this.tileDict.register('icon020.png', 24, 24)
    this.tileDict.register('icon028.png', 24, 24)
    this.tileDict.register('icon002.png', 24, 24)
    this.tileDict.register('icon004.png', 24, 24)
    this.tileDict.register('icon003.png', 24, 24)
    this.tileDict.register('icon030.png', 24, 24)
    this.tileDict.register('icon021.png', 24, 24)
    this.itemDict = new ItemDictionary(ItemJSON, this.tileDict)
    this.enemyDict = new CharaDictionary(EnemyJSON, this.tileDict)
    let farmList = []
    let dropList = []
    let playerList = []
    let npcList = []
    let holdingList = []
    this.keyStore = new KeyboardStore()
    if (keys) {
      keys.space.addEventListener('touchmove', this.keyStore.downKey(' '))
      keys.shift.addEventListener('touchmove', this.keyStore.downKey('Shift'))
      keys.option.addEventListener('touchmove', this.keyStore.downKey('Alt'))
      keys.j.addEventListener('touchmove', this.keyStore.downKey('j'))
      keys.left.addEventListener('touchmove', this.keyStore.downKey('ArrowLeft'))
      keys.up.addEventListener('touchmove', this.keyStore.downKey('ArrowUp'))
      keys.right.addEventListener('touchmove', this.keyStore.downKey('ArrowRight'))
      keys.down.addEventListener('touchmove', this.keyStore.downKey('ArrowDown'))

      keys.space.addEventListener('touchend', this.keyStore.upKey(' '))
      keys.shift.addEventListener('touchend', this.keyStore.upKey('Shift'))
      keys.option.addEventListener('touchend', this.keyStore.upKey('Alt'))
      keys.j.addEventListener('touchend', this.keyStore.upKey('j'))
      keys.left.addEventListener('touchend', this.keyStore.upKey('ArrowLeft'))
      keys.up.addEventListener('touchend', this.keyStore.upKey('ArrowUp'))
      keys.right.addEventListener('touchend', this.keyStore.upKey('ArrowRight'))
      keys.down.addEventListener('touchend', this.keyStore.upKey('ArrowDown'))
    }
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
      let pStat = new CharaStatus("You", 50, 10, 9, 8)
      function makeEnemy(x, y) {
        let e = createWalkAnimatable(tm4, x*TILESIZE, y*TILESIZE, 5)
        return new Character(new CharaStatus("テストさん", 30, 10, 10, 10, 3, true), e, x, y, 0)
      }
      this.player = new Character(pStat, p, 1, 1, 1)
      for (let key in this.itemDict.dict) {
        dropList.push(this.itemDict.make(key))
      }
      for (let key in this.enemyDict.dict) {
        npcList.push(this.enemyDict.make(key))
      }
      playerList.push(this.player)
    // } End Animation Test

    let d = new Dungeon(40, 40)
    d.generate()
    d.place(npcList).map((e, i) => {
      npcList[i].x = e[0]
      npcList[i].y = e[1]
      npcList[i].fix()
    })
    d.place(dropList).map((e, i) => {
      dropList[i].x = e[0]
      dropList[i].y = e[1]
      dropList[i].fix()
    })
    let stair_stat = new FloorProperty('Stair', 'stair')
    let s = new Renderable(d.stair[0]*TILESIZE, d.stair[1]*TILESIZE, this.tm1, 1336)
    let stair = new FloorObject(stair_stat, s, d.stair[0], d.stair[1], 1336)
    console.log(stair)
    let d1 = d.field.map(row => row.map(x => x == 1 ? 1798 : 385))
    let d2 = new Array(40)
    for (let j=0; j < d2.length; ++j) d2[j] = new Array(40).fill(-1)
    this.gameMap = new GameMap("テストダンジョン", 1, this.tm1, this.player, d1, d2, d.field, null, dropList, farmList, npcList, [stair])
    this.player.x = d.playerPosition[0]
    this.player.y = d.playerPosition[1]
    this.player.renderable.prop.x = this.player.x * TILESIZE
    this.player.renderable.prop.y = this.player.y * TILESIZE
    //this.gameMap = new GameMap(this.tm1, this.player, testMap[0], testMap[1], testMap[2], null, dropList, farmList, npcList)
    this.lifecycle = this.genLifeCycle()
    this.dashing = false
    this.shadowOpacity = 1
  }
  damage(from, to, damage) {
    this.damageList.push(new DamageEffect(to, damage))
    this.messageWindow.push(`${from.stat.name}は${to.stat.name}に${damage}のダメージを与えた！`)
    to.stat.hp -= damage
    if (to.stat.hp <= 0) {
      this.messageWindow.push(`${from.stat.name}は${to.stat.name}を倒した！`)
      to.stat.isDead = true
      if (from.stat.enemyId != null && from.stat.superiorId != null) {
        let superior = this.enemyDict.make(from.stat.superiorId)
        superior.x = from.x
        superior.y = from.y
        superior.direction = from.direction
        superior.fix()
        this.gameMap.charaList.push(superior)
        this.messageWindow.push(`${from.stat.name}は${superior.stat.name}に進化した！`)
        from.stat.removeMarked = true
      }
    }
  }
  calcDamage(atk, def) {
    return Math.floor(atk*Math.pow(15/16, def)*(Math.random()*0.4+0.8))
  }
  toMovement(direction) {
    switch (direction) {
      case 'down': return [0, 1]
      case 'down-left': return [-1, 1]
      case 'down-right': return [1, 1]
      case 'left': return [-1, 0]
      case 'right': return [1, 0]
      case 'up': return [0, -1]
      case 'up-left': return [-1, -1]
      case 'up-right': return [1, -1]
      default: return [0, 0]
    }
  }
  playerAttack() {
    let enemies = []
    let holding = this.player.stat.holding
    let weapon = null
    if (holding && holding.stat.type == 'weapon') {
      weapon = holding
    }
    let attackRange = []
    let [x, y] = this.toMovement(this.player.direction)
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
      case 'down-left':
        enemy = (npc.x-1==this.player.x && npc.y+1==this.player.y) ? this.player : this.gameMap.detectChara(npc.x-1, npc.y+1, true)
        break
      case 'left':
        enemy = (npc.x-1==this.player.x && npc.y==this.player.y) ? this.player : this.gameMap.detectChara(npc.x-1, npc.y, true)
        break
      case 'down-right':
        enemy = (npc.x+1==this.player.x && npc.y+1==this.player.y) ? this.player : this.gameMap.detectChara(npc.x+1, npc.y+1, true)
        break
      case 'right':
        enemy = (npc.x+1==this.player.x && npc.y==this.player.y) ? this.player : this.gameMap.detectChara(npc.x+1, npc.y, true)
        break
      case 'up-left':
        enemy = (npc.x-1==this.player.x && npc.y-1==this.player.y) ? this.player : this.gameMap.detectChara(npc.x-1, npc.y-1, true)
        break
      case 'up':
        enemy = (npc.x==this.player.x && npc.y-1==this.player.y) ? this.player : this.gameMap.detectChara(npc.x, npc.y-1, true)
        break
      case 'up-right':
        enemy = (npc.x+1==this.player.x && npc.y-1==this.player.y) ? this.player : this.gameMap.detectChara(npc.x+1, npc.y-1, true)
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
  playerDash() {
    this.dashing = true
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
    } else if (new Date() - this.keyStore.lastDown < 80) {
      return 0
    }
    this.keyStore.omit()
    this.keyStore.lastDown = new Date()
    if (x != 0 || y != 0) {
      if (this.gameMap.collision(this.player.x+x, this.player.y+y) || keys["Alt"]) {
        this.player.direction = direction
      } else {
        this.player.x += x
        this.player.y += y
        this.player.direction = direction
        this.syncAM.push(new Animation(this.player.renderable, direction))
        if (keys['Shift']) {
          this.playerDash()
        }
        return 1
      }
    }
    if (keys['Alt']) {
      this.playerPickUp()
      return 0
    }
    if (keys["Shift"]) {
      /////////////////////////////this.playerPickUp()
      //this.playerDash()
      //return 3
      //return true
      //return 0
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
      return 0
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
    for (let j=0; j < this.gameMap.charaList.length; ++j) {
      const npc = this.gameMap.charaList[j]
      if (npc.removeMarked || npc.isDead) {
        continue
      }
      if (Math.random() < 0.8) {
        this.npcAttack(npc)
        continue
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
        continue
      }
    }
  }
  downStair() {
    let d = new Dungeon(40, 40)
    d.generate()
    let dropList = [], npcList = []
    let dropCount = Math.floor(Math.random() * d.rooms.length+2)
    let enemyCount = 10//Math.floor(Math.random() * d.rooms.length+2)
    for (let j=0; j < dropCount; ++j) {
      const keys = Object.keys(this.itemDict.dict)
      const key = keys[Math.floor(Math.random() * (keys.length-1))]
      dropList.push(this.itemDict.make(key))
    }
    for (let j=0; j < enemyCount; ++j) {
      const keys = Object.keys(this.enemyDict.dict)
      const key = keys[Math.floor(Math.random() * (keys.length-1))]
      npcList.push(this.enemyDict.make(key))
    }
    d.place(npcList).map((e, i) => {
      npcList[i].x = e[0]
      npcList[i].y = e[1]
      npcList[i].fix()
    })
    d.place(dropList).map((e, i) => {
      dropList[i].x = e[0]
      dropList[i].y = e[1]
      dropList[i].fix()
    })
    let stair_stat = new FloorProperty('Stair', 'stair')
    let s = new Renderable(d.stair[0]*TILESIZE, d.stair[1]*TILESIZE, this.tm1, 1336)
    let stair = new FloorObject(stair_stat, s, d.stair[0], d.stair[1], 1336)
    let d1 = d.field.map(row => row.map(x => x == 1 ? 1798 : 385))
    let d2 = new Array(40)
    for (let j=0; j < d2.length; ++j) d2[j] = new Array(40).fill(-1)
    this.gameMap = new GameMap(this.gameMap.name, this.gameMap.floor+1, this.tm1, this.player, d1, d2, d.field, null, dropList, null, npcList, [stair])
    this.player.x = d.playerPosition[0]
    this.player.y = d.playerPosition[1]
    this.player.renderable.prop.x = this.player.x * TILESIZE
    this.player.renderable.prop.y = this.player.y * TILESIZE
  }
  checkPlayerFloor() {
    let foundStair = false
    for (let floor of this.gameMap.floorList) {
      if (this.player.x == floor.x && this.player.y == floor.y) {
        if (floor.stat.objType === 'stair') {
          this.messageWindow.push(`階段がある。`)
          this.upperWindow = new SelectWindow(this.keyStore, ['階段を下りる', '下りない'], [() => {}, () => {}])
          this.upperWindowLifeCycle = this.upperWindow.genLifeCycle()
          foundStair = true
          this.dashing = false
        }
      }
    }
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
    return foundStair ? 1 : 0
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
    this.player.stat.satiety -= this.gameMap.isDungeon ? 1 : 5
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
  continueDash() {
    let keys = {...this.keyStore.get()}
    let x, y
    [x, y] = this.toMovement(this.player.direction)
    if (y == 1) keys['ArrowDown'] = false
    if (y == -1) keys['ArrowUp'] = false
    if (x == 1) keys['ArrowRight'] = false
    if (x == -1) keys['ArrowLeft'] = false
    keys['Shift'] = false
    for (const k in keys) {
      if (keys[k]) {
        this.dashing = false
        return false
      }
    }
    if (this.gameMap.detectFloor(this.player.x, this.player.y)) {
      this.dashing = false
      return false
    }
    if (this.gameMap.detectFarm(this.player.x, this.player.y)) {
      this.dashing = false
      return false
    }
    if (this.gameMap.detectDrop(this.player.x, this.player.y)) {
      this.dashing = false
      return false
    }
    if (this.gameMap.collision(this.player.x+x, this.player.y+y)) {
      this.dashing = false
      return false
    } else {
      this.player.x += x
      this.player.y += y
      this.syncAM.push(new Animation(this.player.renderable, this.player.direction))
      return true
    }
  }
  fadeIn() {
    this.shadowOpacity += 0.026
    if (this.shadowOpacity >= 1) {
      this.shadowOpacity = 1
      return 0
    }
    return 1
  }
  fadeOut() {
    this.shadowOpacity -= 0.025
    if (this.shadowOpacity <= 0) {
      this.shadowOpacity = 0
      return 0
    }
    return 1
  }
  *genLifeCycle() {
    while(!this.bgm.play()) {
      yield 1
    }
    while(this.fadeOut()) {
      yield 1
      console.log('fade')
    }
    while(true) {
      this.date.elapseMinute(this.gameMap.isDungeon ? 1 : 5)
      checkEvent()
      //yield 1
      this.checkGrowth()
      if (this.ignoreLastInput) yield 2
      let canUserInput = true
      if (this.dashing) {
        canUserInput = !this.continueDash()
      }
      if (canUserInput) {
        PlayerTurn: while (true) {
          switch (this.playerAction()) {
            case 0:
              while(this.upperWindow && !this.upperWindow.closed) {
                const v = this.upperWindowLifeCycle.next()
                if (v == 0) {
                  this.upperWindow = null
                } else {
                  yield 1
                }
              }
              this.upperWindow = null
              this.ignoreLastInput = true
              yield 3
              break
            case 1:
              this.ignoreLastInput = false
              break PlayerTurn
            case 2:
              this.ignoreLastInput = false
              yield 3
              break PlayerTurn
          }
        }
      }
      this.updatePlayerStatus()
      //this.removeDeadCharas()
      this.npcAction()
      yield 4
      switch(this.checkPlayerFloor()) {
        case 1: // stair
          while (this.upperWindow && !this.upperWindow.closed) {
            const {value, done} = this.upperWindowLifeCycle.next()
            if (done) {
              switch (value) {
                case 0:
                  this.upperWindow = null
                  while(this.fadeIn()) {
                    yield 1
                  }
                  this.downStair()
                  this.lifecycle = this.genLifeCycle()
                  yield 1
                  break
                case 1:
                  break
                default:
                  yield 1
                  break
              }
            } else {
              yield 1
            }
          }
          this.upperWindow = null
          this.ignoreLastInput = true
          yield 3
          break
        default:
          break
      }
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
    this.ctx.fillText(`${this.gameMap.floor}F / ${this.gameMap.name}`, 780, 20)
    this.ctx.font = "400 18px 'M PLUS Rounded 1c'"
    this.ctx.fillText(`${satiety}%`, 66, 54)
    //this.ctx.strokeText('1F / テスト広場', 780, 32)
    //this.ctx.fillText(`${money}G`, 768, 12)
    this.ctx.textAlign = 'start'
  }
  renderPlayerInventory(mx, my, gx, gy) {
    const inventory = this.player.stat.itemList
    const x = 800 - TILESIZE * (inventory.length+2), y = 480 - TILESIZE*1.5
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
      if (!this.syncAM.empty()) this.syncAM.process()
    } else this.syncAM.process(this.dashing ? 8 : 1)
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
    this.gameMap.renderMiniMap(this.ctx, mx, my, gx, gy)
    this.ctx.fillStyle = 'black'
    this.ctx.globalAlpha = this.shadowOpacity
    this.ctx.fillRect(0, 0, 800, 600)
    this.ctx.globalAlpha = 1
  }
}
