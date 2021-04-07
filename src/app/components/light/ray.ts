import { Line } from "./Line";
import { Vector } from "../../lib/vector";

export class Ray {
    origin: Vector
    direction: Vector
    maxRayLength: number = 500

    constructor(pt: Vector, rad: number) {
        this.origin = pt
        this.direction = new Vector(Math.cos(rad), Math.sin(rad))
    }

    public checkIntersection(lines: Array<Line>): number {
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
        .filter(x => x > 0 && x < this.maxRayLength)
        .reduce((x, y) => Math.min(x, y), Infinity)
    }

    public draw(ctx: CanvasRenderingContext2D, lines: Array<Line> = []) {
        let intersection = this.checkIntersection(lines)
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 0.01
        ctx.moveTo(this.origin.x, this.origin.y)
        if(intersection > -1 && intersection < this.maxRayLength) {
            ctx.lineTo(this.origin.x + this.direction.x * intersection, this.origin.y + this.direction.y * intersection)
        } else {
            ctx.lineTo(this.origin.x + this.direction.x * this.maxRayLength, this.origin.y + this.direction.y * this.maxRayLength)
        }
        ctx.stroke()
    }
}