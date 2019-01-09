

const vertex = [
  0.0, 0.0,
  1.0, 0.0,
  0.0, 1.0,
  1.0, 1.0,
]

const VERTEX_SHADER = `#version 300 es
in vec2 a_texCoord;
out vec2 v_texCoord;

void main() {
   v_texCoord = a_texCoord;
}
`

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
// our texture
uniform sampler2D u_image;
// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;
out vec4 outColor;

void main() {
   // Look up a color from the texture.
   outColor = texture(u_image, v_texCoord);
}
`

function createCanvas() {
  return document.createElement('canvas')
}

function installCanvas(root) {
  let canvas = createCanvas()
  canvas.width = 640
  canvas.height = 480
  root.appendChild(canvas)
  return canvas
}

class GL {
  constructor(root) {
    this.canvas = installCanvas(document.body)
    this.gl = this.canvas.getContext('webgl2')
    if (!this.gl) {
      console.log('webgl2 is unsupported')
    }
  }
  createShader(type, source) {
    const gl = this.gl
    let shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
      return shader
    }
    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
  }
  createProgram(vertexShader, fragmentShader) {
    const gl = this.gl
    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    let success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
      return program
    }
    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
  }
  // Vertex Buffer Object(VBO)
  // GPU-side memory buffer
  // since mapping to client-side memory, can read and write from client
  createVBO(data) {
    const gl = this.gl
    let vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    // STATIC - constant
    // DYNAMIC - modifies many times
    // STREAM - modifies every frame
    // DRAW - client -> GL
    // READ - GL -> client
    // COPY - GL -> GL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return vbo
  }
  // Index Buffer Object(IBO)
  //
  createIBO(data) {
    const gl = this.gl
    let ibo = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    return ibo
  }
  setAttribute(vbo, attL, attS) {
    const gl = this.gl
    for (let i in vbo) {
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i])
      gl.enableVertexAttribArray(attL[i])
      gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0)
    }
  }

  createTexture(src) {
    const gl = this.gl
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => {
        let tex = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        gl.generateMipmap(gl.TEXTURE_2D)
        gl.bindTexture(gl.TEXTURE_2D, null)
        resolve(tex)
      }
      img.src = src
    })
  }

  mainLoop() {
    const gl = this.gl
      }
}

window.onload = () => {
  let glc = new GL(document.body)
  const gl = glc.gl
  let vs = glc.createShader(gl.VERTEX_SHADER, VERTEX_SHADER)
  let fs = glc.createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  let program = glc.createProgram(vs, fs)
  let attrLocs = [gl.getAttribLocation(program, 'a_texCoord')]
  let attrSizes = [2]
  let imgLoc = gl.getUniformLocation(program, 'u_image')
  let vbo = glc.createVBO(vertex)
  let tex
  function mainLoop() {
    //gl.viewport(0, 0, glc.canvas.width, glc.canvas.height)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    glc.setAttribute(vbo, attrLocs, attrSizes)
    gl.activeTexture(gl.TEXTURE0 + 0)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.uniform1i(imgLoc, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 4)
    
    console.log('rendered')
  }

  glc.createTexture('./lena.jpg').then((texture) => {
    console.log('image loaded')
    tex = texture
    mainLoop()
    gl.flush()
  })
}
