import { Vector } from "src/app/lib/vector";
import { BoidSettings } from "./BoidSettings";

export interface Boid {
    position: Vector,
    velocity: Vector,
    perception: number,
    acceleration: Vector,
    speed: number,

    // fieldOfView: number,
    // viewDistance: number,
}

export class BoidPopulation {
    boids: Boid[]
    separation: number
    alignment: number
    cohesion: number
    width: number
    height: number

    constructor(settings: BoidSettings) {
        this.separation = settings.separation
        this.alignment = settings.alignment
        this.cohesion = settings.cohesion
        this.width = settings.width
        this.height = settings.height
        this.boids = []
        for(let i = 0; i < settings.populationSize; i++) {
            let velocityX = Math.cos(Math.random() * 2 * Math.PI)
            let velocityY = Math.sqrt(1 - velocityX * velocityX)
            this.boids.push({
                position: new Vector(Math.random() * this.width, Math.random() * this.height),
                velocity: new Vector(velocityX, velocityY).scale(settings.speed),
                acceleration: new Vector(0, 0),
                perception: 100*100,
                speed: settings.speed
            })
        }
    }

    update() {
        this.boids = this.boids.map(b => {
            let boidsInRange = this.boids.filter(b2 => (b.position.sub(b2.position)).magSquared() < b.perception)

            let avg = boidsInRange.reduce((accu, curr) => {
                return {
                    velocity: curr.velocity.add(accu.velocity),
                    position: curr.position.add(accu.position)
                }
            }, {position: new Vector(0, 0), velocity: new Vector(0, 0)})

            let avgVel = avg.velocity.scale(1/boidsInRange.length)
            let avgPos = avg.position.scale(1/boidsInRange.length)

            let align = avgVel.sub(b.velocity).scale(this.alignment)
            let coh = avgPos.sub(b.position).scale(this.cohesion)
            let sep = this.separationForce(b, boidsInRange.filter(b2 => b != b2)).scale(this.separation)
            let vel = b.velocity.add(align).add(coh).add(sep).norm().scale(b.speed)

            let next = b.position
                .add(vel)
                .apply(v => {
                    return new Vector((v.x + this.width) % this.width, (v.y + this.height) % this.height)
                })

            return {
                position: next,
                velocity: vel,
                acceleration: align.add(coh),
                perception: b.perception,
                speed: b.speed
            }
        })
    }

    draw(ctx: CanvasRenderingContext2D, hasLines: Boolean) {
        this.boids.forEach(b => {
            if(hasLines) {
                let boidsInRange = this.boids.filter(b2 => (b.position.sub(b2.position)).magSquared() < b.perception && b != b2)
                boidsInRange.forEach(b2 => {
                    ctx.beginPath()
                    let strength = (b2.position.sub(b.position)).magSquared()/b.perception
                    let color = Math.floor(Math.sqrt(strength) * 255)
                    ctx.strokeStyle = 'rgb(' + color + ',' + color + ',' + color + ')'
                    ctx.moveTo(b.position.x, b.position.y)
                    ctx.lineTo(b2.position.x, b2.position.y)
                    ctx.stroke()
                })
            } else {
                ctx.fillStyle = 'rgb(0, 0, 0)'
                this.drawBoid(ctx, b)
            }
          })
    }

    drawBoid(ctx: CanvasRenderingContext2D, b: Boid) {
        // let theta = Math.acos(b.velocity.x / b.velocity.mag())
        // let trianglePoints = [
        //     b.position.add(new Vector(15, 0).rotate2D(theta)),
        //     b.position.add(new Vector(0, 5).rotate2D(theta)),
        //     b.position.add(new Vector(0, -5).rotate2D(theta))
        // ]
        // ctx.beginPath()
        // ctx.fillStyle = 'rgb(225, 225, 225)'
        // ctx.moveTo(trianglePoints[0].x, trianglePoints[0].y)
        // ctx.lineTo(trianglePoints[1].x, trianglePoints[1].y)
        // ctx.lineTo(trianglePoints[2].x, trianglePoints[2].y)
        // ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = 'rgb(225, 225, 225)'
        ctx.arc(b.position.x, b.position.y, 5, 0, Math.PI * 2)
        ctx.fill()
    };

    // boid should not be in boids - function does not check for this
    separationForce(boid: Boid, boids: Array<Boid>): Vector {
        return boids.map(b => boid.position.sub(b.position)).reduce((accu, curr) => {
            return accu.add(curr.norm())
        }, new Vector(0, 0))
    }
}