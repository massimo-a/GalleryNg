import { Vector } from "src/app/lib/vector"

interface FluidCell {
    prevVelX: number,
    prevVelY: number,
    velX: number,
    velY: number,
    prevDye: number,
    dye: number
}

export class Fluid {
    size: number
    numCells: number
    cellSize: number
    // data: Array<FluidCell>
    dt: number
    diff: number
	visc: number

    prevVelX: Array<number>
    prevVelY: Array<number>
    velX: Array<number>
    velY: Array<number>
    prevDye: Array<number>
    dye: Array<number>

    constructor(size: number, cellSize: number, dt: number = 0.0005, diff: number = 0, visc: number = 0) {
        this.size = size
        this.cellSize = cellSize
        this.numCells = parseInt((this.size/this.cellSize).toFixed(0))
        this.dt = dt
        this.diff = diff
        this.visc = visc
        // this.data = new Array(this.numCells*this.numCells).fill(this.initFluidCell())
        this.prevVelX = new Array(this.numCells*this.numCells).fill(0)
        this.prevVelY = new Array(this.numCells*this.numCells).fill(0)
        this.velX = new Array(this.numCells*this.numCells).fill(0)
        this.velY = new Array(this.numCells*this.numCells).fill(0)
        this.prevDye = new Array(this.numCells*this.numCells).fill(0)
        this.dye = new Array(this.numCells*this.numCells).fill(0)
    }

    step() {
        this.diffuse(1, this.prevVelX, this.velX)
        this.diffuse(2, this.prevVelY, this.velY)

        this.project(this.prevVelX, this.prevVelY, this.velX, this.velY)

        this.advect(1, this.velX, this.prevVelX, this.prevVelX, this.prevVelY)
        this.advect(2, this.velY, this.prevVelY, this.prevVelX, this.prevVelY)

        this.project(this.velX, this.velY, this.prevVelX, this.prevVelY)

        this.diffuse(0, this.prevDye, this.dye)
        this.advect(0, this.dye, this.prevDye, this.velX, this.velY)
    }

    draw(ctx: CanvasRenderingContext2D) {
        for(let i = 0; i < this.numCells; i++) {
            for(let j = 0; j < this.numCells; j++) {
                ctx.fillStyle = 'RGB(' + Math.floor(this.dye[this.getIndex(i, j)]) + ', 0, 0)'
                ctx.fillRect(i*this.cellSize, j*this.cellSize, this.cellSize, this.cellSize)
            }
        }
    }

    addDye(x: number, y: number, amt: number): Fluid {
        this.dye[this.getIndex(x, y)] += amt
        return this
    }

    addVelocity(x: number, y: number, amt: Vector): Fluid {
        this.velX[this.getIndex(x, y)] += amt.x
        this.velY[this.getIndex(x, y)] += amt.y
        return this
    }

    private diffuse(side: number, x: Array<number>, prevX: Array<number>) {
        let a = this.dt * this.diff * (this.numCells - 2) * (this.numCells - 2)
        this.solveLinEq(side, x, prevX, a, 1 + 6 * a)
    }
    
    private project(velArrX: Array<number>, velArrY: Array<number>, pArr: Array<number>, divArr: Array<number>) {
        for (let j = 1; j < this.numCells - 1; j++) {
            for (let i = 1; i < this.numCells - 1; i++) {
                divArr[this.getIndex(i, j)] = -0.5 *
                    (velArrX[this.getIndex(i+1, j)] -
                    velArrX[this.getIndex(i-1, j)] +
                    velArrY[this.getIndex(i, j+1)] -
                    velArrY[this.getIndex(i, j-1)])/this.numCells
                pArr[this.getIndex(i, j)] = 0
            }
        }
        this.setBounds(0, divArr)
        this.setBounds(0, pArr)
        this.solveLinEq(0, pArr, divArr, 1, 6)
        
        for (let j = 1; j < this.numCells - 1; j++) {
            for (let i = 1; i < this.numCells - 1; i++) {
                velArrX[this.getIndex(i, j)] -= 0.5 * (pArr[this.getIndex(i+1, j)] - pArr[this.getIndex(i-1, j)]) * this.numCells
                velArrY[this.getIndex(i, j)] -= 0.5 * (pArr[this.getIndex(i, j+1)] - pArr[this.getIndex(i, j-1)]) * this.numCells
            }
        }
        this.setBounds(1, velArrX)
        this.setBounds(2, velArrY)
    }

    private advect(side: number, arr: Array<number>, prevArr: Array<number>, velX: Array<number>, velY: Array<number>) {
        let dtx = this.dt * (this.numCells - 2)
        let dty = this.dt * (this.numCells - 2)
        
        for(let j = 1; j < this.numCells - 1; j++) {
            for(let i = 1; i < this.numCells - 1; i++) {
                let x = i - dtx * velX[this.getIndex(i, j)]
                let y = j - dty * velY[this.getIndex(i, j)]
                
                if(x < 0.5) x = 0.5
                if(x > this.numCells - 1.5) x = this.numCells - 1.5
                
                let i0 = Math.floor(x)
                let i1 = i0 + 1.0
                
                if(y < 0.5) y = 0.5
                if(y > this.numCells - 1.5) y = this.numCells - 1.5
                
                let j0 = Math.floor(y)
                let j1 = j0 + 1.0
                
                let s1 = x - i0
                let s0 = 1.0 - s1
                let t1 = y - j0
                let t0 = 1.0 - t1
                
                arr[this.getIndex(i, j)] =
                    s0*(t0 * prevArr[this.getIndex(i0, j0)] + t1 * prevArr[this.getIndex(i0, j1)]) + 
                    s1*(t0 * prevArr[this.getIndex(i1, j0)] + t1 * prevArr[this.getIndex(i1, j1)])
            }
        }
        this.setBounds(side, prevArr);
    }

    private getIndex(x: number, y: number): number {
        return x + y * this.numCells
    }

    private setBounds(side: number, x: Array<number>) {
        for(let i = 1; i < this.numCells - 1; i++) {
            x[this.getIndex(i, 0)] =
                side == 2 ? -x[this.getIndex(i, 1)] : x[this.getIndex(i, 1)]
            x[this.getIndex(i, this.numCells-1)] =
                side == 2 ? -x[this.getIndex(i, this.numCells-2)] : x[this.getIndex(i, this.numCells-2)]
        }
        for(let j = 1; j < this.numCells - 1; j++) {
            x[this.getIndex(0, j)] =
                side == 1 ? -x[this.getIndex(1, j)] : x[this.getIndex(1, j)]
            x[this.getIndex(this.numCells-1, j)] =
                side == 1 ? -x[this.getIndex(this.numCells-2, j)] : x[this.getIndex(this.numCells-2, j)]
        }
        
        x[this.getIndex(0, 0)] = 0.5 * (x[this.getIndex(1, 0)] + x[this.getIndex(0, 1)]);
        x[this.getIndex(0, this.numCells-1)] = 0.5 * (x[this.getIndex(1, this.numCells-1)] + x[this.getIndex(0, this.numCells-2)])
        x[this.getIndex(this.numCells-1, 0)] = 0.5 * (x[this.getIndex(this.numCells-2, 0)] + x[this.getIndex(this.numCells-1, 1)])
        x[this.getIndex(this.numCells-1, this.numCells-1)] = 0.5 * (x[this.getIndex(this.numCells-2, this.numCells-1)] + x[this.getIndex(this.numCells-1, this.numCells-2)])
    }

    private solveLinEq(side: number, x: Array<number>, prevX: Array<number>, a: number, c: number) {
        let cRecip = 1.0 / c;
        for(let k = 0; k < 4; k++) {
            for(let j = 1; j < this.numCells - 1; j++) {
                for (let i = 1; i < this.numCells - 1; i++) {
                    x[this.getIndex(i, j)] =
                        (prevX[this.getIndex(i, j)] + a*
                            (prevX[this.getIndex(i+1, j)] +
                            prevX[this.getIndex(i-1, j)] +
                            prevX[this.getIndex(i, j+1)] +
                            prevX[this.getIndex(i, j-1)])
                        )*cRecip
                }
            }
            this.setBounds(side, x);
        }
    }

    private initFluidCell(): FluidCell {
        return {
            dye: 0,
            prevDye: 0,
            velX: 0,
            velY: 0,
            prevVelX:0,
            prevVelY:0
        }
    }
}