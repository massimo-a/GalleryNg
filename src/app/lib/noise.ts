import { Vector } from './vector'

export class Noise {
    constructor() {}
    
    public hash(x: number): number {
        return x*2903 + 5501
    }

    public rand(seed: number, v: Vector): number {
        let s = Math.sin(seed*this.hash(v.x) + this.hash(v.y))*seed
        return s - Math.floor(s)
    }

    public lerp(v: Vector, t: number): number {
        return v.x*(1-t) + v.y*t
    }

    public smooth(a: number): number {
        return a*a*a*(a*(a*6 - 15) + 10)
    }

    public valueNoise(v: Vector, seed: number): number {
        let id = v.map(Math.floor)
        let lv = v.sub(id).map(this.smooth)
        let b = this.lerp(new Vector(this.rand(seed, id), this.rand(seed, id.add(new Vector(1, 0)))), lv.x)
        let t = this.lerp(new Vector(this.rand(seed, id.add(new Vector(0, 1))), this.rand(seed, id.add(new Vector(1, 1)))), lv.x)
        return this.lerp(new Vector(b, t), lv.y)
    }

    public fractalNoise(per: number, lac: number, oct: number, seed: number): (v: Vector) => number {
        let _this = this
        return function(v: Vector) {
            let p = per
            let l = lac
            let max = 0
            let accu = 0
            for(let i = 0; i < oct; i++) {
                accu = accu + _this.valueNoise(v.scale(l), seed)*p
                max = max + p
                p = p*per
                l = l*lac
            }
            return accu/max
        }
    }

    public fractalNoiseWith(f: (a: number) => number, per: number, lac: number, oct: number, seed: number): (v: Vector) => number {
        let _this = this
        return function(v: Vector) {
            let p = per
            let l = lac
            let max = 0
            let accu = 0
            for(let i = 0; i < oct; i++) {
                accu = accu + f(_this.valueNoise(v.scale(l), seed))*p
                max = max + p
                p = p*per
                l = l*lac
            }
            return accu/max
        }
    }
}