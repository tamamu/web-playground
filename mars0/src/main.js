
import {KeyboardStore} from "./keyboard"
import {Renderable} from "./renderable"
import {Animatable, Animation, AnimationState, AnimationManager} from "./animation"

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
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
    this.renderable.prop.x = this._x * 32
    this.renderable.prop.y = this._y * 32
  }
  fix() {
    this.renderable.prop.x = this.x * 32
    this.renderable.prop.y = this.y * 32
    this.renderable.prop.tileId = this.tileId
  }
}

class ItemState {
  constructor(name) {
    this.name = name
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
    this.itemList = []
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
    ctx.fillRect(x, y, x+800, y+this.height)
    for (let j=0; j < this.messages.length; ++j) {
      ctx.fillStyle = 'white'
      ctx.fillText(this.messages[j], 0, y+this.fontSize*j+4*j)
    }
  }
}

function createWalkAnimatable(tm, x, y, tileId) {
  return new Animatable(x, y, tm, tileId, {
    "right-attack": [
      new AnimationState(32, 0, 7, 150),
      new AnimationState(-32, 0, 7, 150),
    ],
    "right": [
      new AnimationState(8, 0, 6, 50),
      new AnimationState(8, 0, 7, 50),
      new AnimationState(8, 0, 8, 50),
      new AnimationState(8, 0, 7, 50),
    ],
    "left-attack": [
      new AnimationState(-32, 0, 4, 150),
      new AnimationState(32, 0, 4, 150),
    ],
    "left": [
      new AnimationState(-8, 0, 3, 50),
      new AnimationState(-8, 0, 4, 50),
      new AnimationState(-8, 0, 5, 50),
      new AnimationState(-8, 0, 4, 50),
    ],
    "up-attack": [
      new AnimationState(0, -32, 10, 150),
      new AnimationState(0, 32, 10, 150),
    ],
    "up": [
      new AnimationState(0, -8, 9, 50),
      new AnimationState(0, -8, 10, 50),
      new AnimationState(0, -8, 11, 50),
      new AnimationState(0, -8, 10, 50),
    ],
    "down-attack": [
      new AnimationState(0, 32, 1, 150),
      new AnimationState(0, -32, 1, 150),
    ],
    "down": [
      new AnimationState(0, 8, 0, 50),
      new AnimationState(0, 8, 1, 50),
      new AnimationState(0, 8, 2, 50),
      new AnimationState(0, 8, 1, 50),
    ],
    "down-right": [
      new AnimationState(8, 8, 0, 50),
      new AnimationState(8, 8, 1, 50),
      new AnimationState(8, 8, 2, 50),
      new AnimationState(8, 8, 1, 50),
    ],
    "down-left": [
      new AnimationState(-8, 8, 0, 50),
      new AnimationState(-8, 8, 1, 50),
      new AnimationState(-8, 8, 2, 50),
      new AnimationState(-8, 8, 1, 50),
    ],
    "up-right": [
      new AnimationState(8, -8, 9, 50),
      new AnimationState(8, -8, 10, 50),
      new AnimationState(8, -8, 11, 50),
      new AnimationState(8, -8, 10, 50),
    ],
    "up-left": [
      new AnimationState(-8, -8, 9, 50),
      new AnimationState(-8, -8, 10, 50),
      new AnimationState(-8, -8, 11, 50),
      new AnimationState(-8, -8, 10, 50),
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
    this.holdingList = this.renderableList[0] = []
    this.dropList = this.renderableList[1] = []
    this.playerList = this.renderableList[2] = []
    this.npcList = this.renderableList[3] = []
    this.keyStore = new KeyboardStore()
    this.messageWindow = new MessageWindow(5, 18)
    document.addEventListener("keydown", this.keyStore.onKeyDown.bind(this.keyStore))
    document.addEventListener("keyup", this.keyStore.onKeyUp.bind(this.keyStore))
    // Tile Manage Test {
      this.tm1 = new TileManager("./resources/base.png", 16, 16)
      this.tm2 = new TileManager("./resources/kabe-ue_doukutu1.png", 16, 16)
      this.tm3 = new TileManager("./resources/pipo-charachip002a.png", 32, 32)
      this.tm4 = new TileManager("./resources/pipo-charachip019c.png", 32, 32)
      this.tm_coin = new TileManager("./resources/icon020.png", 24, 24)
      this.tm_seed = new TileManager("./resources/icon021.png", 24, 24)
    // } End Tile Manage Test
    // Animation Test {
      let p = createWalkAnimatable(this.tm3, 1*32, 1*32, 1)
      let e = createWalkAnimatable(this.tm4, 9*32, 1*32, 5)
      let c = new Renderable(1*32, 4*32, this.tm_coin, 0)
      let pStat = new CharaStatus("You", 50, 10, 9, 8)
      let eStat = new CharaStatus("Enemy", 10, 5, 4, 3, true)
      let cStat = new ItemState("Coin")
      this.player = new Character(pStat, p, 1, 1, 1)
      this.enemy = new Character(eStat, e, 9, 1, 5)
      this.coin = new Item(cStat, c, 1, 4, 0)
      this.dropList.push(this.coin)
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
    this.syncAM.push(new Animation(this.player.renderable, `${this.player.direction}-attack`, () => {
      if (enemy) {
        let damage = Math.max(0, this.calcDamage(this.player.stat.atk, enemy.stat.def))
        this.damage(this.player, enemy, damage)
      } else {
        this.messageWindow.push("そこには誰もいない。")
      }
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
      return this.playerAttack()
    }
    return 0
  }
  playerPickUp() {
    let j, target = null
    for (j = 0; j < this.dropList.length; ++j) {
      if (this.player.x == this.dropList[j].x && this.player.y == this.dropList[j].y) {
        target = this.dropList[j]
        break
      }
    }
    if (target) {
      if (this.player.stat.holding) {
        let holding = this.player.stat.holding
        holding.move(this.player.x, this.player.y)
        this.player.stat.holding = target
        this.dropList.splice(j, 1, holding)
        this.messageWindow.push(`${target.stat.name}と床に落ちている${holding.stat.name}を交換した。`)
      } else {
        this.player.stat.holding = target
        this.dropList.splice(j, 1)
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
    if (Math.random() < 0.1) {
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
  *genLifeCycle() {
    while(true) {
      checkEvent()
      //yield 1
      checkGrowth()
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
  renderFieldTile(id, x, y) {
    this.tm1.render(this.ctx, 8*162, x, y, 32, 32)
    switch (id) {
      case 0:
        //this.ctx.fillStyle = "#efefef"
        break
      case 1:
        this.tm2.render(this.ctx, 2, x, y, 32, 32)
        break
      default:
        this.ctx.fillStyle = "red"
        break
    }
    //this.ctx.fillRect(x, y, x+32, y+32)
  }
  renderField() {
    for (let y = 0; y < this.field.length; ++y) {
      for (let x = 0; x < this.field[y].length; ++x) {
        this.renderFieldTile(this.field[y][x], x*32, y*32)
      }
    }
  }
  renderObjects() {
    for (let priority of this.renderableList) {
      for (let r of priority) {
        r.renderable.tiles.render(this.ctx, r.renderable.prop.tileId, r.renderable.prop.x, r.renderable.prop.y, 32, 32)
      }
    }
  }
  update() {
    if (this.syncAM.empty()) {
      this.syncAM.wait()
      this.lifecycle.next()
    } else {
      this.syncAM.process()
    }
    this.asyncAM.process()
  }
  render() {
    this.renderField()
    this.renderObjects()
    if (this.player.stat.holding) {
      let holding = this.player.stat.holding.renderable
      holding.tiles.render(this.ctx, holding.prop.tileId, this.player.renderable.prop.x, this.player.renderable.prop.y-20, 32, 32)
    }
    this.messageWindow.render(this.ctx, 0, 600-this.messageWindow.height)
  }
}
