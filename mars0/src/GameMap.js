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
  detectChara(x, y, isEnemy) {
    for (const chara of this.charaList) {
      if (chara.x == x && chara.y == y) {
        if (isEnemy && !chara.stat.isEnemy) {
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
      if (x.stat.isDead) {
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

