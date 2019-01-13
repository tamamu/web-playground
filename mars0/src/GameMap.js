import {TILESIZE} from './constants'

export default class GameMap {
  constructor(name, floor, tm, player, base, second, collision, nuts, dropList, farmList, charaList, floorList, isDungeon=true) {
    this.name = name
    this.floor = floor
    this.tm = tm
    this.height = base.length
    this.width = base[0].length
    this.baseLayer = base
    this.secondLayer = second
    this._collision = collision
    this.nuts = nuts
    this.dropList = dropList ? dropList : []
    this.farmList = farmList ? farmList : []
    this.charaList = charaList ? charaList : []
    this.floorList = floorList ? floorList : []
    this.animTimer = new Date()
    this.player = player
    this.isDungeon = isDungeon
    this.reached = new Array(this.height)
    this.lightMap = new Array(this.height)
    for (let y=0; y < this.height; ++y) {
      this.reached[y] = new Array(this.width).fill(0)
      this.lightMap[y] = new Array(this.width).fill(0)
    }
  }
  updateReached() {
    for (let y=0; y < this.height; ++y) {
      for (let x=0; x < this.width; ++x) {
        this.lightMap[y][x] = 0
      }
    }
    let opened = [
      [this.player.x, this.player.y],
    ]
    let closed = []
    while (opened.length > 0) {
      let floors = []
      const head = opened.pop()
      const [x, y] = head
      this.reached[y][x] = 1
      this.lightMap[y][x] = 1
      closed.push(head)
      if (!this.collisionWall(x-1, y)) {
        floors.push([x-1, y])
        this.reached[y][x-1] = 1
        this.lightMap[y][x-1] = 1
      }
      if (!this.collisionWall(x+1, y)) {
        floors.push([x+1, y])
        this.reached[y][x+1] = 1
        this.lightMap[y][x+1] = 1
      }
      if (!this.collisionWall(x, y-1)) {
        floors.push([x, y-1])
        this.reached[y-1][x] = 1
        this.lightMap[y-1][x] = 1
      }
      if (!this.collisionWall(x, y+1)) {
        floors.push([x, y+1])
        this.reached[y+1][x] = 1
        this.lightMap[y+1][x] = 1
      }
      if (!this.collisionWall(x-1, y-1)) {
        floors.push([x-1, y-1])
        this.reached[y-1][x-1] = 1
        this.lightMap[y-1][x-1] = 1
      }
      if (!this.collisionWall(x+1, y-1)) {
        floors.push([x+1, y-1])
        this.reached[y-1][x+1] = 1
        this.lightMap[y-1][x+1] = 1
      }
      if (!this.collisionWall(x-1, y+1)) {
        floors.push([x-1, y+1])
        this.reached[y+1][x-1] = 1
        this.lightMap[y+1][x-1] = 1
      }
      if (!this.collisionWall(x+1, y+1)) {
        floors.push([x+1, y+1])
        this.reached[y+1][x+1] = 1
        this.lightMap[y+1][x+1] = 1
      }
      if (floors.length >= 3) {
        floors.map(f => {
          let alreadyClosed = false
          for (const c of closed) {
            if (c[0] == f[0] && c[1] == f[1]) {
              alreadyClosed = true
              break
            }
          }
          if (!alreadyClosed) {
            opened.push(f)
          }
        })
      }
    }

  }
  collisionWall(x, y) {
    if (y >= this.height || y < 0 || x >= this.width || x < 0) {
      return true
    }
    return this._collision[y][x] > 0
  }
  collision(x, y) {
    return this.collisionWall(x, y) || this.detectChara(x, y, false)
  }
  _openPath(x, y, f) {
    let nodes = []
    if (x-1 >= 0 && f(x-1, y)) {
      nodes.push([x-1, y])
    }
    if (x+1 < this.width && f(x+1, y)) {
      nodes.push([x+1, y])
    }
    if (y-1 >= 0 && f(x, y-1)) {
      nodes.push([x, y-1])
    }
    if (y+1 < this.height && f(x, y+1)) {
      nodes.push([x, y+1])
    }
    if (x-1 >= 0 && y-1 >= 0 && f(x-1, y-1)) {
      nodes.push([x-1, y-1])
    }
    if (x+1 < this.width && y-1 >= 0 && f(x+1, y-1)) {
      nodes.push([x+1, y-1])
    }
    if (x-1 >= 0 && y+1 < this.height && f(x-1, y+1)) {
      nodes.push([x-1, y+1])
    }
    if (x+1 < this.width && y+1 < this.height && f(x+1, y+1)) {
      nodes.push([x+1, y+1])
    }
    return nodes
  }
  findRoute(x1, y1, x2, y2) {
    let nodes = []
    for (let j = 0; j < this.height; ++j) {
      let row = []
      for (let k = 0; k < this.width; ++k) {
        const h = Math.abs(x2 - k) + Math.abs(y2 - j)
        row.push({
          x: k, y: j, from: null,
          stat: this.collisionWall(k, j) ? -1 : 0,
          c: 0,
          h,
          s: h
        })
      }
      nodes.push(row)
    }
    nodes[y1][x1].stat = 1
    let base = nodes[y1][x1]
    console.log(base)
    let opened = this._openPath(x1, y1, (x, y) => nodes[y][x].stat == 0).map(n => nodes[n[1]][n[0]])
    Search: while(opened.length > 0) {
      console.log(opened)
      for (let j = 0; j < opened.length; ++j) {
        const n = opened[j]
        n.from = [base.x, base.y]
        n.stat = 1
        n.c += 1
        n.s = n.c + n.h
        if (n.x == x2 && n.y == y2) {
          break Search
        }
      }
      let _opened = opened.map(node =>
        this._openPath(node.x, node.y,
          (x, y) => x < this.width && y < this.height && nodes[y][x].stat == 0))
      opened = []
      for (const n of _opened) {
        if (n.length > 0) {
          for (const p of n) {
            let exists = false
            for (const m of opened) {
              if (m.x == p[1] && m.y == p[0]) {
                exists = true
                break
              }
            }
            if (!exists) opened.push(nodes[p[1]][p[0]])
          }
        }
      }
      if (opened.length > 0) {
        opened.sort((a, b) => {
          if (a.s == b.s) {
            return a.c < b.c
          } else {
            return a.s < b.s
          }
        })
        base = opened[0]
      }
    }
    let path = []
    let n = nodes[y2][x2]
    console.log(n)
    let c = 0
    while (n.from != null) {
      path.push(n)
      const [x, y] = n.from
      n = nodes[y][x]
      c += 1
      if (c > 2) break
    }
    path.reverse()
    return path
  }
  detectChara(x, y, isEnemy) {
    for (const chara of this.charaList) {
      if (chara.x == x && chara.y == y) {
        if (isEnemy && !chara.stat.enemyId == null) {
          continue
        }
        return chara
      }
    }
    return null
  }
  detectFloor(x, y) {
    for (const floor of this.floorList) {
      if (floor.x == x && floor.y == y) {
        return floor
      }
    }
    return null
  }
  detectDrop(x, y) {
    for (const drop of this.dropList) {
      if (drop.x == x && drop.y == y) {
        return drop
      }
    }
    return null
  }
  detectFarm(x, y) {
    for (const farm of this.farmList) {
      if (farm.x == x && farm.y == y) {
        return farm
      }
    }
    return null
  }
  update() {
    if (new Date() - this.animTimer > 1600) {
      this.animTimer = new Date()
    }
    this.charaList = this.charaList.filter(x => {
      if (x.stat.removeMarked || x.stat.isDead) {
        //this.messageWindow.push(`${x.stat.name}を倒した。`)
        return false
      }
      return true
    })
    this.updateReached()
  }
  render(ctx, mx, my, gx, gy) {
    for (let y = Math.max(my, 0); y < this.height; ++y) {
      for (let x = Math.max(mx, 0); x < this.width; ++x) {
        this.tm.render(ctx, this.baseLayer[y][x], x*TILESIZE+gx, y*TILESIZE+gy, TILESIZE, TILESIZE)
      }
    }
    for (let y = Math.max(my, 0); y < this.height; ++y) {
      for (let x = Math.max(mx, 0); x < this.width; ++x) {
        this.tm.render(ctx, this.secondLayer[y][x], x*TILESIZE+gx, y*TILESIZE+gy, TILESIZE, TILESIZE)
      }
    }

    const now = new Date()
    const d = Math.min(8, (now - this.animTimer) / 200)
    for (let priority of [this.floorList, this.farmList, this.dropList, [this.player], this.charaList]) {
      for (let r of priority) {
        if (r.stat.type) {
          ctx.globalAlpha = 0.8 - (d/10)
          ctx.globalCompositeOperation = 'source-atop'
          r.renderable.tiles.render(ctx, r.renderable.prop.tileId, r.renderable.prop.x+gx-d, r.renderable.prop.y+gy-d, TILESIZE*0.8+d*2, TILESIZE*0.8+d*2)
          ctx.globalAlpha = 1
          r.renderable.tiles.render(ctx, r.renderable.prop.tileId, r.renderable.prop.x+gx, r.renderable.prop.y+gy, TILESIZE*0.8, TILESIZE*0.8)
          ctx.globalCompositeOperation = 'source-over'
        } else {
          r.renderable.tiles.render(ctx, r.renderable.prop.tileId, r.renderable.prop.x+gx, r.renderable.prop.y+gy, TILESIZE, TILESIZE)
        }
      }
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    for (let y = Math.max(my, 0); y < this.height; ++y) {
      for (let x = Math.max(mx, 0); x < this.width; ++x) {
        if (this.lightMap[y][x] == 0) {
          ctx.fillRect(x*TILESIZE+gx, y*TILESIZE+gy, TILESIZE, TILESIZE)
        }
      }
    }
  }
  renderMiniMap(ctx, mx, my, gx, gy) {
    const bin = 5, left = 800-bin*(this.width+5), top = 64
    ctx.globalAlpha = 0.45
    ctx.fillStyle = 'rgb(50, 50, 255)'
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        if (this.reached[y][x] > 0) {
          ctx.fillRect(left+x*bin, top+y*bin, bin, bin)
        }
      }
    }
    ctx.fillStyle = 'yellow'
    for (const drop of this.dropList) {
      ctx.fillRect(left+drop.x*bin, top+drop.y*bin, bin, bin)
    }
    ctx.fillStyle = 'red'
    for (const chara of this.charaList) {
      ctx.fillRect(left+chara.x*bin, top+chara.y*bin, bin, bin)
    }
    ctx.fillStyle = 'white'
    ctx.fillRect(left+this.player.x*bin, top+this.player.y*bin, bin, bin)
    ctx.globalAlpha = 1
  }
}

