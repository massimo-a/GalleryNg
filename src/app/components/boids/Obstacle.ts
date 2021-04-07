import { Vector } from "src/app/lib/vector";
import { Boid } from "./Boid";

export class Obstacle {
    position: Vector
    size: number
    
    constructor(position: Vector, size: number) {
        this.position = position
        this.size = size
    }

    getForceAway(boid: Boid): Vector {
        let forceAway = boid.position.sub(this.position)
        let dist = forceAway.mag() - this.size
        if(dist*dist < boid.perception) {
            return forceAway.norm().scale(1/dist)
        } else {
            return new Vector(0, 0)
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#000000'
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI)
        ctx.fill()
    }
}