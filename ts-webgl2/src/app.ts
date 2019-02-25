
const VS1 = `#version 300 es
uniform mat4 uModelMat;
uniform mat4 uViewMat;
uniform mat4 uProjectionMat;
in vec3 aPos;
in vec3 aNormal;
out vec3 vNormal;
void main() {
    mat4 mvpMat = uProjectionMat * uViewMat * uModelMat;
    vNormal = mat3(mvpMat) * normalize(aNormal);
    gl_Position = mvpMat * vec4(aPos.xyz, 1);
}
`

const FS1 = `#version 300 es
precision mediump float;
uniform mat4 uInvMat;
uniform vec3 uLightDirection;
in vec3 vNormal;
out vec4 FragColor;
void main() {
    vec3 normal = normalize(vNormal);
    vec3 invLight = normalize(uInvMat * vec4(uLightDirection, 0.0)).xyz;
    
    float light = dot(normal, invLight);
    float diffuse = clamp(light, 0.1, 1.0);
    
    FragColor = vec4(1.0, 0.0, 0.7, 1.0);
    FragColor.rgb *= vec3(diffuse);
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
    constructor(arr: Float32Array | null = null) {
        if (arr) {
            this.raw = arr
        } else {
            this.raw = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ])
        }
    }
    public view() {
        return this.raw
    }
    public invert() {
        const a00 = this.raw[0], a01 = this.raw[1], a02 = this.raw[2], a03 = this.raw[3],
              a10 = this.raw[4], a11 = this.raw[5], a12 = this.raw[6], a13 = this.raw[7],
              a20 = this.raw[8], a21 = this.raw[9], a22 = this.raw[10], a23 = this.raw[11],
              a30 = this.raw[12], a31 = this.raw[13], a32 = this.raw[14], a33 = this.raw[15]

        const b00 = a00 * a11 - a01 * a10,
              b01 = a00 * a12 - a02 * a10,
              b02 = a00 * a13 - a03 * a10,
              b03 = a01 * a12 - a02 * a11,
              b04 = a01 * a13 - a03 * a11,
              b05 = a02 * a13 - a03 * a12,
              b06 = a20 * a31 - a21 * a30,
              b07 = a20 * a32 - a22 * a30,
              b08 = a20 * a33 - a23 * a30,
              b09 = a21 * a32 - a22 * a31,
              b10 = a21 * a33 - a23 * a31,
              b11 = a22 * a33 - a23 * a32

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) { 
            throw new Error('Determinant is NaN') 
        }
        det = 1.0 / det;

        const out = new Float32Array(16)
        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det
        return new TransformMatrix(out)
    }
    public multiply(right: TransformMatrix) {
        const out = new Float32Array(16)
        for (let i=0; i < 4; ++i) {
            for (let j=0; j < 4; ++j) {
                let tmp = 0
                for (let k=0; k < 4; ++k) {
                    tmp += this.raw[i*4+k] * this.raw[k*4+j]
                }
                out[i*4+j] = tmp
            }
        }
        return new TransformMatrix(out)
    }
    public frustum_(left: number, right: number, bottom: number, top: number, near: number, far: number) {
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

    public translate_(x: number, y: number, z: number) {
        this.raw[12] += this.raw[0] * x + this.raw[4] * y + this.raw[8] * z
        this.raw[13] += this.raw[1] * x + this.raw[5] * y + this.raw[9] * z
        this.raw[14] += this.raw[2] * x + this.raw[6] * y + this.raw[10] * z
        this.raw[15] += this.raw[3] * x + this.raw[7] * y + this.raw[11] * z
    }

    public rotate_(rad: number, axis: Float32Array) {
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

function getUniformLocationChecked(gl: WebGL2RenderingContext, program: WebGLProgram, name: string) {
    const loc = gl.getUniformLocation(program, name)
    if (loc) {
        return loc
    } else {
        throw new Error(`Failed to get uniform location: ${name}`)
    }
}

class ImageProgram {
    public program: WebGLProgram
    public vao: WebGLVertexArrayObject
    private loc_uModelMat: WebGLVertexArrayObject
    private uModelMat: TransformMatrix
    private loc_uViewMat: WebGLVertexArrayObject
    private uViewMat: TransformMatrix
    private loc_uProjectionMat: WebGLUniformLocation
    private uProjectionMat: TransformMatrix
    private loc_uInvMat: WebGLUniformLocation
    private uInvMat: TransformMatrix
    private loc_uLightDirection: WebGLUniformLocation
    private uLightDirection: Float32Array
    constructor(gl: WebGL2RenderingContext) {
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS1);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS1);
        this.program = createProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(this.program)

        {
            this.loc_uModelMat = getUniformLocationChecked(gl, this.program, 'uModelMat')
            this.uModelMat = new TransformMatrix()
            this.uModelMat.rotate_(0, Vec3.from(0, 1, 0))
            gl.uniformMatrix4fv(this.loc_uModelMat, false, this.uModelMat.view())
        }
        {
            this.loc_uViewMat = getUniformLocationChecked(gl, this.program, 'uViewMat')
            this.uViewMat = new TransformMatrix()
            this.uViewMat.translate_(0, 0, -2);
            gl.uniformMatrix4fv(this.loc_uViewMat, false, this.uViewMat.view())
        }
        {
            this.loc_uProjectionMat = getUniformLocationChecked(gl, this.program, 'uProjectionMat')
            this.uProjectionMat = new TransformMatrix()
            this.uProjectionMat.frustum_(-1, 1, -1, 1, 1, 3)
            gl.uniformMatrix4fv(this.loc_uProjectionMat, false, this.uProjectionMat.view())
        }
        {
            this.loc_uInvMat = getUniformLocationChecked(gl, this.program, 'uInvMat')
            this.uInvMat = this.uProjectionMat.multiply(this.uViewMat.multiply(this.uModelMat)).invert()
            gl.uniformMatrix4fv(this.loc_uInvMat, false, this.uInvMat.view())
        }
        {
            this.loc_uLightDirection = getUniformLocationChecked(gl, this.program, 'uLightDirection')
            this.uLightDirection = Vec3.from(0, 0, 1)
            gl.uniform3fv(this.loc_uLightDirection, this.uLightDirection)
        }
        const vao = gl.createVertexArray()
        if (vao) {
            this.vao = vao
            gl.bindVertexArray(this.vao)

            const aPosLoc = gl.getAttribLocation(this.program, 'aPos')
            {
                const aPosBuf = gl.createBuffer()
                gl.bindBuffer(gl.ARRAY_BUFFER, aPosBuf)
                const positions = [
                    -0.5, -0.5, 0,
                    0.5, -0.5, 0,
                    0.5, 0.5, 0,
                    -0.5, -0.5, 0,
                    0.5, 0.5, 0,
                    0.5, -0.5, 0,
                ]
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
                gl.enableVertexAttribArray(aPosLoc)
                gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, false, 0, 0)
            }
    
            const aNormalLoc = gl.getAttribLocation(this.program, 'aNormal')
            {
                const aNormalBuf = gl.createBuffer()
                gl.bindBuffer(gl.ARRAY_BUFFER, aNormalBuf)
                const positions = [
                    0, 0, -1,
                    0, 0, -1,
                    0, 0, -1,
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,
                ]
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
                gl.enableVertexAttribArray(aNormalLoc)
                gl.vertexAttribPointer(aNormalLoc, 3, gl.FLOAT, false, 0, 0)
            }
        } else {
            throw new Error('Failed to create vertex array')
        }
        gl.useProgram(null)
    }
    public rect(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number) {
        const positions = [
            x, y,
            x+width, y,
            x, y+height,
            x+width, y+height,
        ]
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(positions), 0)
    }
    public rotate(gl: WebGL2RenderingContext, frame: number) {
        gl.useProgram(this.program)
        this.uModelMat.rotate_(frame * 0.01, Vec3.from(0.0, 1.0, 0.0))
        gl.uniformMatrix4fv(this.loc_uModelMat, false, this.uModelMat.view())
        this.uInvMat = this.uProjectionMat.multiply(this.uViewMat.multiply(this.uModelMat)).invert()
        gl.uniformMatrix4fv(this.loc_uInvMat, false, this.uInvMat.view())
        gl.useProgram(null)
    }
    public lookAt(gl: WebGL2RenderingContext, frame: number) {
        gl.useProgram(this.program)
      //this.uViewMat = new TransformMatrix()
      //this.uViewMat.translate_(0, 0, -(frame % 2000) * 0.001)
        this.uViewMat.rotate_(frame * 0.001, Vec3.from(0.5, 0.5, 0.0))
        gl.uniformMatrix4fv(this.loc_uViewMat, false, this.uViewMat.view())
        this.uInvMat = this.uProjectionMat.multiply(this.uViewMat.multiply(this.uModelMat)).invert()
        gl.uniformMatrix4fv(this.loc_uInvMat, false, this.uInvMat.view())
        gl.useProgram(null)
    }
    public withBind(gl: WebGL2RenderingContext, f: Function) {
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
    private view: number = 0
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        const context = canvas.getContext('webgl2')
        if (context) {
            this.gl = context
            this.imageProgram = new ImageProgram(this.gl)
            const gl = this.gl
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.enable(gl.CULL_FACE);
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
        gl.clearColor(0, 0, 0, 1)
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.imageProgram.withBind(gl, () => {
            const x = Math.sin(this.uptime/1000)
            const y = Math.cos(this.uptime/1000)
            //this.imageProgram.rect(gl, x, y, x+0.5, y+0.5)
            gl.drawArrays(gl.TRIANGLES, 0, 6)
        })

        this.imageProgram.rotate(this.gl, (Date.now()-this.renderTime)/10)
        this.imageProgram.lookAt(this.gl, (Date.now()-this.renderTime)/10)
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
