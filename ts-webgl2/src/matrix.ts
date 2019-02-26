
export class Vec3 {
    public static from(x: number, y: number, z: number) {
        return new Float32Array([
            x, y, z
        ])
    }
    public static cross(a: Float32Array, b: Float32Array) {
        return new Float32Array([
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ])
    }
    public static sub(a: Float32Array, b: Float32Array) {
        return new Float32Array([
            a[0] - b[0],
            a[1] - b[1],
            a[2] - b[2]
        ])
    }
    public static normalize(a: Float32Array) {
        const length = Math.pow((a[0] * a[0]) + (a[1] * a[1]) + (a[2] * a[2]), 0.5)
        return new Float32Array([
            a[0] / length,
            a[1] / length,
            a[2] / length
        ])
	}
}

export class Vec4 {
    public static from(x: number, y: number, z: number, w: number) {
        return new Float32Array([
            x, y, z, w
        ])
    }
}

export class TransformMatrix {
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

    public lookAt_(ex: number, ey: number, ez: number, tx: number, ty: number, tz: number, ux: number, uy: number, uz: number) {
        const out = new Float32Array(16)
        let z0 = ex - tx, z1 = ey - ty, z2 = ez - tz
        let len = 1 / Math.sqrt(z0*z0+z1*z1+z2*z2)
        z0 *= len, z1 *= len, z2 *= len
        let x0 = uy * z2 - uz * z1
        let x1 = uz * z0 - ux * z2
        let x2 = ux * z1 - uy * z0
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2)
        if (!len) {
            x0 = 0
            x1 = 0
            x2 = 0
        } else {
            len = 1 / len
            x0 *= len
            x1 *= len
            x2 *= len
        }

        let y0 = z1 * x2 - z2 * x1
        let y1 = z2 * x0 - z0 * x2
        let y2 = z0 * x1 - z1 * x0
        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2)
        if (!len) {
            y0 = 0
            y1 = 0
            y2 = 0
        } else {
            len = 1 / len
            y0 *= len
            y1 *= len
            y2 *= len
        }

        out[0] = x0
        out[1] = y0
        out[2] = z0
        out[3] = 0
        out[4] = x1
        out[5] = y1
        out[6] = z1
        out[7] = 0
        out[8] = x2
        out[9] = y2
        out[10] = z2
        out[11] = 0
        out[12] = -(x0 * ex + x1 * ey + x2 * ez)
        out[13] = -(y0 * ex + y1 * ey + y2 * ez)
        out[14] = -(z0 * ex + z1 * ey + z2 * ez)
        out[15] = 1
        return out
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

    public perspective_(fovy: number, aspect: number, near: number, far: number) {
        const out = new Float32Array(16)
        let f = 1.0 / Math.tan(fovy / 2), nf;
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[15] = 0;
        if (far != null && far !== Infinity) {
          nf = 1 / (near - far);
          out[10] = (far + near) * nf;
          out[14] = (2 * far * near) * nf;
        } else {
          out[10] = -1;
          out[14] = -2 * near;
        }
        return out;
    } 
}

