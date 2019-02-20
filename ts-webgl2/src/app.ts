
const VS1 = `#version 300 es
in vec2 aPos;
void main() {
    gl_Position = vec4(aPos.xy, 0, 1);
}
`

const FS1 = `#version 300 es
precision mediump float;
out vec4 FragColor;
void main() {
    FragColor = vec4(1, 0, 0.5, 1);
}
`

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    let shader = gl.createShader(type);
    if (shader) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        } else {
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }
    }
    throw new Error('Failed to create shader')
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    let program = gl.createProgram();
    if (program) {
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        } else {
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
        }
    }
    throw new Error('Failed to create shader program')
}

class ImageProgram {
    public program: WebGLProgram
    public vao: WebGLVertexArrayObject
    constructor(gl: WebGL2RenderingContext) {
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS1);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS1);
        this.program = createProgram(gl, vertexShader, fragmentShader);

        const aPosLoc = gl.getAttribLocation(this.program, 'aPos')
        const aPosBuf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, aPosBuf)
        const positions = [
            0, 0,
            0.5, 0,
            0, 0.5,
            0.5, 0.5,
        ]
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW)
        const vao = gl.createVertexArray()
        if (vao) {
            this.vao = vao
            gl.bindVertexArray(this.vao)
            gl.enableVertexAttribArray(aPosLoc)
            gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0)
        } else {
            throw new Error('Failed to create vertex array')
        }
    }
    rect(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number) {
        const positions = [
            x, y,
            x+width, y,
            x, y+height,
            x+width, y+height,
        ]
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(positions), 0)
    }
    withBind(gl: WebGL2RenderingContext, f: Function) {
        gl.useProgram(this.program)
        gl.bindVertexArray(this.vao)
        f()
        gl.bindVertexArray(null)
        gl.useProgram(null)
    }
}

class GLApp {
    private canvas: HTMLCanvasElement
    private gl: WebGL2RenderingContext
    private imageProgram: ImageProgram
    static initTime: number = Date.now()
    private uptime: number = 0
    private renderTime: number = 0
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        const context = canvas.getContext('webgl2')
        if (context) {
            this.gl = context
            this.imageProgram = new ImageProgram(this.gl)
        } else {
            throw new Error('WebGL2 has not been supported!')
        }
    }
    private update() {
        this.uptime = Date.now() - GLApp.initTime
    }
    private render() {
        const gl = this.gl
        gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        this.imageProgram.withBind(gl, () => {
            const x = Math.sin(this.uptime/1000)
            const y = Math.cos(this.uptime/1000)
            this.imageProgram.rect(gl, x, y, x+0.5, y+0.5)
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        })

        this.renderTime = Date.now()
    }
    public mainLoop() {
        this.update()
        if (Date.now() - this.renderTime > 1000/60) {
            this.render()
        }
        requestAnimationFrame(this.mainLoop.bind(this))
    }
}

window.onload = () => {
    let body = document.body
    let canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    body.appendChild(canvas)
    let app = new GLApp(canvas);
    app.mainLoop()
}
