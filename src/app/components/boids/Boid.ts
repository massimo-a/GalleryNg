import { Vector } from "src/app/lib/vector";
import { BoidSettings } from "./BoidSettings";
import { Obstacle } from "./Obstacle";

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
    obstacleAvoidance: number
    width: number
    height: number
    obstacles: Array<Obstacle>

    constructor(settings: BoidSettings, obstacles: Array<Obstacle> = []) {
        this.separation = settings.separation
        this.alignment = settings.alignment
        this.cohesion = settings.cohesion
        this.width = settings.width
        this.height = settings.height
        this.obstacles = obstacles
        this.obstacleAvoidance = 2
        this.boids = []
        for(let i = 0; i < settings.populationSize; i++) {
            let velocityX = Math.cos(Math.random() * 2 * Math.PI)
            let velocityY = Math.sqrt(1 - velocityX * velocityX)
            this.boids.push({
                position: new Vector(Math.random() * this.width, Math.random() * this.height),
                velocity: new Vector(velocityX, velocityY).scale(settings.speed),
                acceleration: new Vector(0, 0),
                perception: 50*50,
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
            let obs = this.obstacleForces(b).scale(this.obstacleAvoidance)
            let vel = b.velocity.add(align).add(coh).add(sep).add(obs).norm().scale(b.speed)

            let next = b.position
                .add(vel)
                .apply(v => {
                    return new Vector((v.x + this.width) % this.width, (v.y + this.height) % this.height)
                })

            return {
                position: next,
                velocity: vel,
                acceleration: align.add(coh).add(sep).add(obs),
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
        this.obstacles.forEach(o => o.draw(ctx))
    }

    drawBoid(ctx: CanvasRenderingContext2D, b: Boid) {
        ctx.beginPath()
        ctx.fillStyle = '#FFFFFF'
        ctx.arc(b.position.x, b.position.y, 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.strokeStyle = '#FFFFFF'
        ctx.moveTo(b.position.x, b.position.y)
        ctx.lineTo(b.position.x + b.velocity.x * 5, b.position.y + b.velocity.y * 5)
        ctx.stroke()
    };

    // boid should not be in boids - function does not check for this
    separationForce(boid: Boid, boids: Array<Boid>): Vector {
        return boids.map(b => boid.position.sub(b.position)).reduce((accu, curr) => {
            return accu.add(curr.norm())
        }, new Vector(0, 0))
    }

    obstacleForces(b: Boid): Vector {
        return this.obstacles
            .map(o => o.getForceAway(b))
            .reduce((accu, curr) => accu.add(curr), new Vector(0, 0))
    }
}