
class CanvasBuilder {
  private element: HTMLCanvasElement
  constructor() {
    this.element = document.createElement('canvas')
  }
  width(v: number): CanvasBuilder {
    this.element.width = v
    return this
  }
  height(v: number): CanvasBuilder {
    this.element.height = v
    return this
  }
  done(): HTMLCanvasElement {
    return this.element
  }
}

function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>(resolve => {
    let image = new Image()
    image.src = path
    image.onload = () => {
      resolve(image)
    }
  });
}

window.onload = async () => {
  const canvas = new CanvasBuilder()
    .width(800)
    .height(600)
    .done()
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('webgl2')
  ctx.clearColor(0, 0, 0, 1)
  ctx.clear(ctx.COLOR_BUFFER_BIT)
  console.log('loading...')
  const dlang = await loadImage('images/d.png')
  console.log(dlang)
}
