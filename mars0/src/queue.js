export class Queue {
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

