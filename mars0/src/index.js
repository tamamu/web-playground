
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

class KeyboardStore {
  constructor() {
    this.states = {}
  }
  onKeyDown(e) {
    this.states[e.key] = true
  }
  onKeyUp(e) {
    this.states[e.key] = false
  }
  get() {
    /*
    let result = []
    for (const key in this.states) {
      if (this.states[key]) result.push(key)
    }
    return result
    */
    return this.states
  }
}

class Queue {
  constructor(arr = null) {
    this._arr = arr ? arr : new Array()
  }
  head() {
    return this._arr.length > 0 ? this._arr[0] : null
  }
  push(a) {
    this._arr.push(a)
  }
  pop() {
    return this._arr.length > 0 ? this._arr.shift() : null
  }
  size() {
    return this._arr.length
  }
}

class Renderable {
  constructor(x, y, tiles, tileId) {
    this.prop = new RenderableProperty(x, y, tileId)
    this.tiles = tiles
  }
}

class Animatable extends Renderable {
  constructor(x, y, tiles, tileId, animations) {
    super(x, y, tiles, tileId)
    this.animations = animations
  }
}

class RenderableProperty {
  constructor(x, y, tileId) {
    this.x = x
    this.y = y
    this.tileId = tileId
  }
  /*
  set x(value) {
    this.x = value
  }
  set y(value) {
    this.y = value
  }
  set tileId(value) {
    this.tileId = value
  }
  */
}

class AnimationState {
  constructor(x, y, tileId, time) {
    this.time = time
    this.elapsed = 0
    this.tileId = tileId
    this.x = x
    this.y = y
  }
}

class Animation {
  constructor(target, type) {
    this.prevProp = Object.assign({}, target.prop)
    this.prop = target.prop
    let states = []
    for (const s of target.animations[type]) {
      states.push(new AnimationState(s.x, s.y, s.tileId, s.time))
    }
    this.queue = new Queue(states)
  }
}

class AnimationManager {
  constructor() {
    this.animationList = []
    this.lastProcessed = new Date()
  }
  push(animation) {
    this.animationList.push(animation)
  }
  empty() {
    return this.animationList.length == 0
  }
  process() {
    let delta = new Date() - this.lastProcessed
    this.animationList = this.animationList.filter(target => {
      let head = target.queue.head()
      if (!head) {
        return false
      }

      head.elapsed += delta
      while (head.elapsed > head.time) {
        target.prevProp.x += head.x
        target.prevProp.y += head.y
        target.prevProp.tileId = head.tileId
        delta = head.elapsed - head.time
        target.queue.pop()
        head = target.queue.head()
        if (!head) return false
        head.elapsed += delta
      }

      let calculatedX = target.prevProp.x + head.x * head.elapsed / head.time
      let calculatedY = target.prevProp.y + head.y * head.elapsed / head.time
      target.prop.tileId = head.tileId
      target.prop.x = calculatedX
      target.prop.y = calculatedY
      return true
    })
    this.lastProcessed = new Date()
  }
}

class MarsZero {
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

class Game {
  constructor(root, generator) {
    this.screen = document.createElement('canvas')
    this.ctx = this.screen.getContext('2d')
    this.lastRendered = new Date()
    this.width = this.screen.clientWidth
    this.height = this.screen.clientHeight
    this.generator = new generator(this.ctx)
    root.appendChild(this.screen)
  }
  size(width, height) {
    this.width = this.screen.width = width
    this.height = this.screen.height = height
  }
  mainLoop() {
    this.generator.update()
    if (new Date - this.lastRendered > 1000/120) {
      this.generator.render()
      this.lastRendered = new Date()
    }
    requestAnimationFrame(this.mainLoop.bind(this))
  }
}

window.onload = () => {
  let root = document.querySelector('#root')
  let game = new Game(root, MarsZero)
  game.size(320, 240)
  game.mainLoop()
}
