
import {Vec3, Vec4, TransformMatrix} from './matrix'

const VS1 = `#version 300 es
uniform mat4 uModelMat;
uniform mat4 uViewMat;
uniform mat4 uProjectionMat;
uniform mat4 uInvMat;
uniform vec3 uLightDirection;
uniform vec3 uEyeDirection;
uniform vec4 uAmbientColor;
in vec3 aPos;
in vec3 aNormal;
out vec4 vColor;
void main() {
    /*mat4 mvpMat = uProjectionMat * uViewMat * uModelMat;*/
    mat4 mvpMat = uModelMat * uViewMat * uProjectionMat;
    vec3 invLight = normalize(uInvMat * vec4(uLightDirection, 0.0)).xyz;
    vec3 invEye = normalize(uInvMat * vec4(uEyeDirection, 0.0)).xyz;
    vec3 halfLE = normalize(invLight + invEye);
    float diffuse = clamp(dot(aNormal, invLight), 0.0, 1.0);
    float specular = pow(clamp(dot(aNormal, halfLE), 0.0, 1.0), 50.0);
    vec4 color = vec4(1.0, 0.0, 0.7, 1.0);
    vec4 light = color * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0);
    vColor = light + uAmbientColor;
    gl_Position = mvpMat * vec4(aPos, 1);
}
`

const FS1 = `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 FragColor;
void main() {
    FragColor = vColor;
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


function getUniformLocationChecked(gl: WebGL2RenderingContext, program: WebGLProgram, name: string) {
    const loc = gl.getUniformLocation(program, name)
    if (loc) {
        return loc
    } else {
        throw new Error(`Failed to get uniform location: ${name}`)
    }
}

function verticesToNormal(vert: number[]) {
    const result = new Array(vert.length)
    const numPoly = (vert.length / 3) / 3
    for (let j=0; j < numPoly; ++j) {
        const A = Vec3.from(vert[j*9], vert[j*9+1], vert[j*9+2])
        const B = Vec3.from(vert[j*9+3], vert[j*9+3+1], vert[j*9+3+2])
        const C = Vec3.from(vert[j*9+6], vert[j*9+6+1], vert[j*9+6+2])
        const AB = Vec3.sub(B, A)
        const BC = Vec3.sub(C, B)
        const normal = Vec3.normalize(Vec3.cross(AB, BC))
        for (let k=0; k < 3; ++k) {
            result[j*9+k*3] = normal[0]
            result[j*9+k*3+1] = normal[1]
            result[j*9+k*3+2] = normal[2]
        }
    }
    return result
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
    private loc_uAmbientColor: WebGLUniformLocation
    private uAmbientColor: Float32Array
    private loc_uEyeDirection: WebGLUniformLocation
    private uEyeDirection: Float32Array
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
          //this.uViewMat.translate_(0, 0, -2);
            this.uViewMat.lookAt_(0, 0, 10, 0, 0, 0, 0, 1, 0)
            gl.uniformMatrix4fv(this.loc_uViewMat, false, this.uViewMat.view())
        }
        {
            this.loc_uProjectionMat = getUniformLocationChecked(gl, this.program, 'uProjectionMat')
            this.uProjectionMat = new TransformMatrix()
          //this.uProjectionMat.frustum_(-0.5, 0.5, -0.5, 0.5, 0.1, 100)
          this.uProjectionMat.perspective_(45, 640 / 480, 0.1, 20);
            gl.uniformMatrix4fv(this.loc_uProjectionMat, false, this.uProjectionMat.view())
        }
        {
            this.loc_uInvMat = getUniformLocationChecked(gl, this.program, 'uInvMat')
            this.uInvMat = this.uModelMat.invert()
            gl.uniformMatrix4fv(this.loc_uInvMat, false, this.uInvMat.view())
        }
        {
            this.loc_uLightDirection = getUniformLocationChecked(gl, this.program, 'uLightDirection')
            this.uLightDirection = Vec3.from(-0.5, -0.5, 0.5)
            gl.uniform3fv(this.loc_uLightDirection, this.uLightDirection)
        }
        {
            this.loc_uAmbientColor = getUniformLocationChecked(gl, this.program, 'uAmbientColor')
            this.uAmbientColor = Vec4.from(0.1, 0.1, 0.1, 1)
            gl.uniform4fv(this.loc_uAmbientColor, this.uAmbientColor)
        }
        {
            this.loc_uEyeDirection = getUniformLocationChecked(gl, this.program, 'uEyeDirection')
            this.uEyeDirection = Vec3.from(0, 0, 10)
            gl.uniform3fv(this.loc_uEyeDirection, this.uEyeDirection)
        }
        const vao = gl.createVertexArray()
        if (vao) {
            this.vao = vao
            gl.bindVertexArray(this.vao)

            const vert_positions = [
                -0.5, -0.5, 0,
                0.5, 0.5, 0,
                0.5, -0.5, 0,
                0.5, 0.5, 0,
                0.5, -0.5, 0.5,
                0.5, -0.5, 0,
                -0.5, -0.5, 0,
                0.5, -0.5, 0.5,
                0.5, 0.5, 0,
                -0.5, -0.5, 0,
                0.5, -0.5, 0,
                0.5, -0.5, 0.5,
            ]
            const aPosLoc = gl.getAttribLocation(this.program, 'aPos')
            {
                const aPosBuf = gl.createBuffer()
                gl.bindBuffer(gl.ARRAY_BUFFER, aPosBuf)
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vert_positions), gl.STATIC_DRAW)
                gl.enableVertexAttribArray(aPosLoc)
                gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, false, 0, 0)
            }
    
            /*
            const norm_positions = [
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
                -1, 0, 0,
                -1, 0, 0,
                -1, 0, 0,
                0.5, -0.5, -0.5,
                0.5, -0.5, -0.5,
                0.5, -0.5, -0.5,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
            ]
            */
            const norm_positions = verticesToNormal(vert_positions)
            console.log(norm_positions)
            const aNormalLoc = gl.getAttribLocation(this.program, 'aNormal')
            {
                const aNormalBuf = gl.createBuffer()
                gl.bindBuffer(gl.ARRAY_BUFFER, aNormalBuf)
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(norm_positions), gl.STATIC_DRAW)
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
    private updateInvMat(gl: WebGL2RenderingContext) {
        this.uInvMat = this.uModelMat.invert()
        gl.uniformMatrix4fv(this.loc_uInvMat, false, this.uInvMat.view())
    }
    public rotate(gl: WebGL2RenderingContext, frame: number) {
        gl.useProgram(this.program)
        this.uModelMat.rotate_(frame * 0.01, Vec3.from(1.0, 1.0, 0.0))
        gl.uniformMatrix4fv(this.loc_uModelMat, false, this.uModelMat.view())
        this.updateInvMat(gl)
        gl.useProgram(null)
    }
    public lookAt(gl: WebGL2RenderingContext, x: number, z: number) {
        gl.useProgram(this.program)
      //this.uViewMat = new TransformMatrix()
        this.uViewMat.lookAt_(x, 0, z, x, 0, 0, 0, 1, 0)
        this.uEyeDirection = Vec3.from(x, 0, z)
        gl.uniform3fv(this.loc_uEyeDirection, this.uEyeDirection)
        gl.uniformMatrix4fv(this.loc_uViewMat, false, this.uViewMat.view())
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
    private x: number = 0
    private z: number = 10
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
            window.onkeydown = e => {
              switch (e.key) {
                case 'ArrowLeft':
                  this.x += 1
                  break
                case 'ArrowRight':
                  this.x -= 1
                  break
                case 'ArrowUp':
                  this.z += 1
                  break
                case 'ArrowDown':
                  this.z -= 1
                  break
              }
              this.imageProgram.lookAt(this.gl, this.x, this.z)
            }
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
            gl.drawArrays(gl.TRIANGLES, 0, 12)
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
