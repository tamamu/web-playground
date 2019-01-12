
export class KeyboardStore {
  constructor() {
    this.states = {}
    this.lastOmit = new Date()
    this.lastDown = new Date()
  }
  onKeyDown(e) {
    if (!this.states[e.key]) {
      this.states[e.key] = true
      this.lastDown = new Date()
    }
  }
  onKeyUp(e) {
    this.states[e.key] = false
  }
  downKey(k) {
    return () => {
      if (!this.states[k]) {
        this.states[k] = true
        this.lastDown = new Date()
      }
    }
  }
  upKey(k) {
    return () => {
      this.states[k] = false
    }
  }
  get() {

    /*
    let result = []
    for (const key in this.states) {
      if (this.states[key]) result.push(key)
    }
    return result
    */
    //this.lastGet = new Date()
    return this.states
  }
  omit() {
    this.lastOmit = new Date()
  }
}

