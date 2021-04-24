import { Vector } from "src/app/lib/vector";

export class RandomWalker {
    public position: Vector
    public size: number
    public stepSize: number
    
    constructor(pos: Vector = new Vector(0, 0)) {
        this.position = pos
        this.size = 6
        this.stepSize = 10
    }

    public intersection(walkers: Array<RandomWalker>): boolean {
        for(let i = 0; i < walkers.length; i++) {
            if(walkers[i].position.sub(this.position).mag() < walkers[i].size + this.size) {
                return true
            }
        }
        return false
    }

    public update(bounds: Vector = new Vector(1000, 500)) {
        this.position = this.position
            .add(new Vector(Math.random()*2*this.stepSize - this.stepSize, Math.random()*2*this.stepSize - this.stepSize))
        this.position = this.position.apply(v => {
            return new Vector((v.x + bounds.x)%bounds.x, (v.y + bounds.y)%bounds.y)
        })
    }

    public draw(ctx: CanvasRenderingContext2D, color: (pos: Vector) => Vector = (pos) => { return new Vector(1, 1, 1) }) {
        let col = color(this.position).map(x => Math.floor(x*255))
        ctx.beginPath()
        ctx.fillStyle = `rgb(${col.x}, ${col.y}, ${col.z})`
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI)
        ctx.fill()
    }
}