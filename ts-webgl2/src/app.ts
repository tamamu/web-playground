
const VS1 = `#version 300 es
uniform mat4 uModelViewMat;
uniform mat4 uProjectionMat;
in vec3 aPos;
void main() {
    gl_Position = uProjectionMat * uModelViewMat * vec4(aPos.xyz, 1);
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

class Vec3 {
    public static from(x: number, y: number, z: number) {
        return new Float32Array([
            x, y, z
        ])
    }
}

class TransformMatrix {
    private raw: Float32Array
    constructor() {
        this.raw = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
    }
    public view() {
        return this.raw
    }
    public frustum(left: number, right: number, bottom: number, top: number, near: number, far: number) {
        const near2 = 2*near
        const rml = right-left
        const rpl = right+left
        const tmb = top-bottom
        const tpb = top+bottom
        const fmn = far-near
        const fpn = far+near
        this.raw[0] = near2/rml
        this.raw[1] = 0
        this.raw[2] = 0
        this.raw[3] = 0
        this.raw[4] = 0
        this.raw[5] = near2/tmb
        this.raw[6] = 0
        this.raw[7] = 0
        this.raw[8] = rpl/rml
        this.raw[9] = tpb/tmb
        this.raw[10]=-fpn/fmn
        this.raw[11]=-1
        this.raw[12]= 0
        this.raw[13]= 0
        this.raw[14]=-far*near2/fmn
        this.raw[15]= 0
    }

    public translate(x: number, y: number, z: number) {
        this.raw[12] += this.raw[0] * x + this.raw[4] * y + this.raw[8] * z
        this.raw[13] += this.raw[1] * x + this.raw[5] * y + this.raw[9] * z
        this.raw[14] += this.raw[2] * x + this.raw[6] * y + this.raw[10] * z
        this.raw[15] += this.raw[3] * x + this.raw[7] * y + this.raw[11] * z
    }

    public rotate(rad: number, axis: Float32Array) {
        let [x, y, z] = axis
        let len = Math.sqrt(x * x + y * y + z * z)
        if (Math.abs(len) < 0.000001) {
            throw new Error('Vector length Underflow')
        }
        len = 1 / len
        x *= len;
        y *= len;
        z *= len;

        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const t = 1 - c;

        const a00 = this.raw[0], a01 = this.raw[1], a02 = this.raw[2], a03 = this.raw[3]
        const a10 = this.raw[4], a11 = this.raw[5], a12 = this.raw[6], a13 = this.raw[7]
        const a20 = this.raw[8], a21 = this.raw[9], a22 = this.raw[10], a23 = this.raw[11]

        const b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s
        const b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s
        const b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c

        this.raw[0] = a00 * b00 + a10 * b01 + a20 * b02;
        this.raw[1] = a01 * b00 + a11 * b01 + a21 * b02;
        this.raw[2] = a02 * b00 + a12 * b01 + a22 * b02;
        this.raw[3] = a03 * b00 + a13 * b01 + a23 * b02;
        this.raw[4] = a00 * b10 + a10 * b11 + a20 * b12;
        this.raw[5] = a01 * b10 + a11 * b11 + a21 * b12;
        this.raw[6] = a02 * b10 + a12 * b11 + a22 * b12;
        this.raw[7] = a03 * b10 + a13 * b11 + a23 * b12;
        this.raw[8] = a00 * b20 + a10 * b21 + a20 * b22;
        this.raw[9] = a01 * b20 + a11 * b21 + a21 * b22;
        this.raw[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this.raw[11] = a03 * b20 + a13 * b21 + a23 * b22;
    }
}

class ImageProgram {
    public program: WebGLProgram
    public vao: WebGLVertexArrayObject
    private loc_uModelViewMat: WebGLUniformLocation
    private uModelViewMat: TransformMatrix
    private loc_uProjectionMat: WebGLUniformLocation
    private uProjectionMat: TransformMatrix
    constructor(gl: WebGL2RenderingContext) {
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS1);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS1);
        this.program = createProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(this.program)

        const loc_uModelViewMat = gl.getUniformLocation(this.program, 'uModelViewMat')
        if (loc_uModelViewMat) {
            this.loc_uModelViewMat = loc_uModelViewMat
        } else {
            throw new Error('Failed to get uniform location: uModelViewMat')
        }
        this.uModelViewMat = new TransformMatrix()
        this.uModelViewMat.translate(0, -2, -7);
        this.uModelViewMat.rotate(0, Vec3.from(0, 1, 0))
        gl.uniformMatrix4fv(this.loc_uModelViewMat, false, this.uModelViewMat.view())

        const loc_uProjectionMat = gl.getUniformLocation(this.program, 'uProjectionMat')
        if (loc_uProjectionMat) {
            this.loc_uProjectionMat = loc_uProjectionMat
        } else {
            throw new Error('Failed to get uniform location: uProjectionMat')
        }
        this.uProjectionMat = new TransformMatrix()
        this.uProjectionMat.frustum(-1, 1, -1, 1, 3, 10)
        gl.uniformMatrix4fv(this.loc_uProjectionMat, false, this.uProjectionMat.view())

        const aPosLoc = gl.getAttribLocation(this.program, 'aPos')
        const aPosBuf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, aPosBuf)
        const positions = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            0.5, 0.5, 0
        ]
        /*
        const positions = [
            0, 0,
            0.5, 0,
            0, 0.5,
            0.5, 0.5,
        ]
        */
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW)
        const vao = gl.createVertexArray()
        if (vao) {
            this.vao = vao
            gl.bindVertexArray(this.vao)
            gl.enableVertexAttribArray(aPosLoc)
            gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, false, 0, 0)
        } else {
            throw new Error('Failed to create vertex array')
        }
        gl.useProgram(null)
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
    rotate(gl: WebGL2RenderingContext, frame: number) {
        gl.useProgram(this.program)
        this.uModelViewMat.rotate(frame * 0.01, Vec3.from(0, 1, 0))
        gl.uniformMatrix4fv(this.loc_uModelViewMat, false, this.uModelViewMat.view())
        gl.useProgram(null)
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
            //this.imageProgram.rect(gl, x, y, x+0.5, y+0.5)
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3)
        })

        this.imageProgram.rotate(this.gl, (Date.now()-this.renderTime)/10)
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

interface CapturableHTMLCanvasElement extends HTMLCanvasElement {
    captureStream(): any
}

function captureCanvas(canvas: HTMLCanvasElement, time: number) {
    const stream = (<CapturableHTMLCanvasElement> canvas).captureStream()
    const recorder = new MediaRecorder(stream)
    let chunks: BlobPart[] = []
    console.log(stream)
    recorder.addEventListener('dataavailable', e => {
        const be = e as BlobEvent
        chunks.push(be.data)
        console.log(be)
    })
    recorder.addEventListener('stop', () => {
        const blob = new Blob(chunks, {type: 'video/webm'});
        const e: HTMLVideoElement = document.createElement('video')
        console.log(blob)
        const anchor = document.createElement('a')
        const now = new Date()
        anchor.href = window.URL.createObjectURL(blob)
        anchor.download = `canvas_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.webm`
        anchor.click()
    })
    recorder.start(1000/40)
    setTimeout(() => {
        recorder.stop();
    }, time)
}

window.onload = () => {
    let body = document.body
    let canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    body.appendChild(canvas)
    let app = new GLApp(canvas);
    //captureCanvas(canvas, 10 * 1000)
    app.mainLoop()
}
