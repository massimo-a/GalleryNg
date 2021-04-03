import { Vector } from "../lib/vector"

export class Distance {
	constructor() {}

	manhattan(v1: Vector, v2: Vector): number {
		return Math.abs(v1.sub(v2).x) + Math.abs(v1.sub(v2).y)
	}
	euclidean(v1: Vector, v2: Vector): number {
		return v1.sub(v2).mag()
	}
	minkowski(v1: Vector, v2: Vector, p: number): number {
		let v = v1.sub(v2)
		return Math.pow(Math.pow(Math.abs(v.x), p) + Math.pow(Math.abs(v.y), p), 1/p)
	}
	chebyshev(v1: Vector, v2: Vector): number {
		let v = v1.sub(v2)
		return Math.max(Math.abs(v.x), Math.abs(v.y))
	}
	canberra(v1: Vector, v2: Vector): number {
		let v3 = new Vector(Math.abs(v1.x), Math.abs(v1.x))
		let v4 = new Vector(Math.abs(v2.x), Math.abs(v2.x))
		let v = v1.sub(v2)
		let a = v3.add(v4)
		let u = new Vector(Math.abs(v.x)/Math.abs(a.x), Math.abs(v.y)/Math.abs(a.y))
		return u.x + u.y
	}
	getDistance(s: string): (v1: Vector, v2: Vector) => number {
		if(s === "manhattan") {
			return this.manhattan
		} else if(s === "euclid") {
			return this.euclidean
		} else if(s === "cheby") {
			return this.chebyshev
		} else {
			return this.euclidean
		}
	}
}