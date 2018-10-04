
import {KeyboardStore} from "./keyboard"
import {Animatable, Animation, AnimationState, AnimationManager} from "./animation"

function checkEvent() {
  console.log("checkEvent")
}

function checkGrowth() {
  console.log("checkGrowth")
}

function animationTrigger() {
  console.log("animationTrigger")
}

function playerAction() {
  console.log("playerAction")
}

function checkPlayerFloor() {
  console.log("checkPlayerFloor")
}

function npcAction() {
  console.log("npcAction")
}

function checkNpcFloor() {
  console.log("checkNpcFloor")
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

export default class MarsZero {
  constructor(ctx) {
    this.ctx = ctx
    this.field = testMap
    this.syncAM = new AnimationManager()
    this.asyncAM = new AnimationManager()
    this.renderableList = []
    this.keyStore = new KeyboardStore()
    document.addEventListener("keydown", this.keyStore.onKeyDown.bind(this.keyStore))
    document.addEventListener("keyup", this.keyStore.onKeyUp.bind(this.keyStore))
    // Animation Test {
      this.player = {x: 1, y: 1}
      let t = document.createElement('canvas')
      t.width = t.height = 32
      let tctx = t.getContext('2d')
      tctx.fillStyle = 'green'
      tctx.fillRect(0, 0, 32, 32)
      let p = new Animatable(this.player.x*32, this.player.y*32, [t], 0, {
        "left": [new AnimationState(-32, 0, 0, 300)],
        "right": [new AnimationState(32, 0, 0, 300)],
        "up": [new AnimationState(0, -32, 0, 300)],
        "down": [new AnimationState(0, 32, 0, 300)],
      })
      this.renderableList.push(p)
    // } End Animation Test
    this.lifecycle = this.genLifeCycle()
  }
  playerAction() {
    let keys = this.keyStore.get()
    console.log(keys)
    if (keys["ArrowDown"]) {
      this.syncAM.push(new Animation(this.renderableList[0], "down"))
      return true
    } else if (keys["ArrowUp"]) {
      this.syncAM.push(new Animation(this.renderableList[0], "up"))
      return true
    } else if (keys["ArrowLeft"]) {
      this.syncAM.push(new Animation(this.renderableList[0], "left"))
      return true
    } else if (keys["ArrowRight"]) {
      this.syncAM.push(new Animation(this.renderableList[0], "right"))
      return true
    }
    return false
  }
  *genLifeCycle() {
    while(true) {
      checkEvent()
      yield 1
      checkGrowth()
      yield 2
      while (true) {
        if (this.playerAction()) {
          break
        } else {
          yield 3
        }
      }
      checkPlayerFloor()
      npcAction()
      checkNpcFloor()
      yield 4
    }
  }
  renderFieldTile(id, x, y) {
    switch (id) {
      case 0:
        this.ctx.fillStyle = "#efefef"
        break
      case 1:
        this.ctx.fillStyle = "#999999"
        break
      default:
        this.ctx.fillStyle = "red"
        break
    }
    this.ctx.fillRect(x, y, x+32, y+32)
  }
  renderField() {
    for (let y = 0; y < this.field.length; ++y) {
      for (let x = 0; x < this.field[y].length; ++x) {
        this.renderFieldTile(this.field[y][x], x*32, y*32)
      }
    }
  }
  renderObjects() {
    for (let r of this.renderableList) {
      this.ctx.drawImage(r.tiles[r.prop.tileId], r.prop.x, r.prop.y)
    }
  }
  update() {
    if (this.syncAM.empty()) {
      this.lifecycle.next()
    } else {
      this.syncAM.process()
    }
    this.asyncAM.process()
  }
  render() {
    this.renderField()
    this.renderObjects()
  }
}


