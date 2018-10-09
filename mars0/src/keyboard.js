
export class KeyboardStore {
  constructor() {
    this.states = {}
    this.lastGet = new Date()
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
    this.lastGet = new Date()
    return this.states
  }
}

