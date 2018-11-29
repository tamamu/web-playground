
function randint(from, to) {
  return from + Math.floor(Math.random() * (to-from))
}

export default class Dungeon {
  constructor(w, h) {
    this.width = w
    this.height = h
    this.field = new Array(h)
    this.rooms = []
    this.playerPosition = [0, 0]
    this.stair = null
    this.init()
  }

  init() {
    for (let y=0; y < this.height; ++y) {
      this.field[y] = new Array(this.width).fill(1)
    }
  }

  place(list) {
    let result = []
    for (let j = 0; j < list.length; ++j) {
      let duplicate
      do {
        duplicate = false
        let room = this.rooms[randint(0, this.rooms.length)]
        let x = randint(room[0], room[0]+room[2])
        let y = randint(room[1], room[1]+room[3])
        result[j] = [x, y]
        for (let k = 0; k < j; ++k) {
          if (result[j][0] == result[k][0] && result[j][1] == result[k][1]) {
            duplicate = true
            break
          }
        }
        if (result[j][0] == this.playerPosition[0] && result[j][1] == this.playerPosition[1]) {
          duplicate = true
        }
      } while (duplicate)
    }
    return result
  }

  installStair() {
    if (this.rooms.length == 0) {
      return 0
    }
    const room = this.rooms[randint(0, this.rooms.length)]
    const x = randint(room[0], room[0]+room[2])
    const y = randint(room[1], room[1]+room[3])
    this.stair = [x, y]
    return 1
  }

  generate() {
    while(this.rooms.length < 2) {
      this.rooms = []
      this.init()
      this.divHorizontal(1, 1, this.width-1, this.height-1)
    }
    this.installStair()
    let connected = new Array(this.rooms.length)
    for (let j=0; j < connected.length; ++j) {
      connected[j] = new Array(this.rooms.length).fill(false)
    }
    for (let j=1; j < this.rooms.length; ++j) {
      this.connect(this.rooms[j-1], this.rooms[j])
      connected[j-1][j] = connected[j][j-1] = true
    }
    for (let j=0; j < this.rooms.length-1; ++j) {
      for (let k=1; k < this.rooms.length; ++k) {
        if (!connected[j][k] && Math.random() > 0.5) {
          this.connect(this.rooms[j], this.rooms[k])
          connected[j][k] = connected[k][j] = true
        }
      }
    }
    const pr = this.rooms[randint(0, this.rooms.length-1)]
    this.playerPosition = [randint(pr[0], pr[0]+pr[2]), randint(pr[1], pr[1]+pr[3])]
  }

  divVertical(x1, y1, x2, y2) {
    console.log("v", x1, y1, x2, y2)
    if (x2 - x1 < 8 && y2 - y1 < 8) {
      this.generateRoom(x1, y1, x2-2, y2-2)
      return
    }

    if (y2 - y1 >= 12) {
      let divy = randint(y1+4, y2-4)
      this.divHorizontal(x1, y1, x2, divy-1)
      this.divHorizontal(x1, divy+1, x2, y2)
    }
  }

  divHorizontal(x1, y1, x2, y2) {
    console.log("h", x1, y1, x2, y2)
    if (x2 - x1 < 8 && y2 - y1 < 8) {
      this.generateRoom(x1, y1, x2-2, y2-2)
      return
    }

    if (x2 - x1 >= 12) {
      let divx = randint(x1+4, x2-4)
      this.divVertical(x1, y1, divx-1, y2)
      this.divVertical(divx+1, y1, x2, y2)
    }
  }

  generateRoom(x1, y1, x2, y2) {
    if (x2-x1+1 < 4 || y2-y1+1 < 4) {
      return
    }
    let rw = randint(4, x2-x1+1)
    let rh = randint(4, y2-y1+1)
    let rx = randint(x1, Math.max(0, x2-rw))
    let ry = randint(y1, Math.max(0, y2-rh))
    this.fill(0, rx, ry, rx+rw, ry+rh)
    this.rooms.push([rx, ry, rw, rh])
  }

  connect(r1, r2) {
    console.log(r1, r2)
    const r1w = r1[2]
    const r1x = r1[0] + randint(1, r1w-2)
    const r1h = r1[3]
    const r1y = r1[1] + randint(1, r1h-2)
    const r2w = r2[2]
    const r2x = r2[0] + randint(1, r2w-2)
    const r2h = r1[3]
    const r2y = r2[1] + randint(1, r2h-2)
    console.log('connect', r1x, r1y, r2x, r2y)
    switch (randint(0, 1)) {
      case 0:
        this.fill(0, r1x, r1y, r2x, r1y)
        this.fill(0, r2x, r1y, r2x, r2y)
        break
      case 1:
        this.fill(0, r1x, r1y, r1x, r2y)
        this.fill(0, r1x, r2y, r2x, r2y)
        break
    }
  }

  fill(id, x1, y1, x2, y2) {
    const x = Math.min(x1, x2)
    const y = Math.min(y1, y2)
    const w = Math.max(x1, x2) - x + 1
    const h = Math.max(y1, y2) - y + 1
    for (let j=0; j < h; ++j) {
      for (let k=0; k < w; ++k) {
        this.field[y+j][x+k] = id
      }
    }
  }
}

