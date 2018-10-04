
import {Queue} from "./queue"
import {Renderable, RenderableProperty} from "./renderable"

export class Animatable extends Renderable {
  constructor(x, y, tiles, tileId, animations) {
    super(x, y, tiles, tileId)
    this.animations = animations
  }
}

export class AnimationState {
  constructor(x, y, tileId, time) {
    this.time = time
    this.elapsed = 0
    this.tileId = tileId
    this.x = x
    this.y = y
  }
}

export class Animation {
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

export class AnimationManager {
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

