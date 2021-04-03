import { Line } from "../data/Line";
import { Vector } from "./vector";

export class Ray {
    origin: Vector
    direction: Vector

    constructor(pt: Vector, rad: number) {
        this.origin = pt
        this.direction = new Vector(Math.cos(rad), Math.sin(rad))
    }

    public checkIntersection(lines: Array<Line>): number {
        let maxRayLength = 100

        return lines.map(line => {
            let lineDir = line.end.sub(line.start).norm()
            let u = line.start.sub(this.origin).cross2d(this.direction)/this.direction.cross2d(lineDir)
            let t = line.start.sub(this.origin).cross2d(lineDir)/this.direction.cross2d(lineDir)
            if(u > 0 && u < 1) {
                return t
            } else {
                return -1
            }
        })
        .filter(x => x > 0 && x < maxRayLength)
        .reduce((x, y) => Math.min(x, y), Infinity)
    }
}