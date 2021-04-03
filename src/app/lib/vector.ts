export class Vector {
    readonly x: number
    readonly y: number
    readonly z: number

    constructor(x: number, y: number, z: number = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    public add(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z)
    }

    public sub(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z)
    }

    public scale(a: number): Vector {
        return new Vector(this.x * a, this.y * a, this.z * a)
    }

    public dot(v: Vector): number {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }

    public mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    public magSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }

    public norm(): Vector {
        let m = this.mag()
        return new Vector(this.x/m, this.y/m, this.z/m)
    }

    public cross(v: Vector): Vector {
        return new Vector(this.y*v.z - this.z*v.y, this.z*v.x - this.x*v.z, this.x*v.y - this.y*v.x)
    }

    public cross2d(v: Vector): number {
        return this.x*v.y - this.y*v.x
    }

    public hadamard(v: Vector): Vector {
        return new Vector(this.x*v.x, this.y*v.y, this.z*v.z)
    }

    public rotate2D(theta: number): Vector {
        return new Vector(this.x*Math.cos(theta) - this.y*Math.sin(theta), this.x*Math.sin(theta) + this.y*Math.cos(theta))
    }

    public map(f: (a: number) => number): Vector {
        return new Vector(f(this.x), f(this.y), f(this.z))
    }

    public apply(f: (v: Vector) => Vector): Vector {
        return f(this)
    }
}