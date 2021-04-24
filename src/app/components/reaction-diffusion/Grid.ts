/**
 * A_1 = A_0 + dt * (d_a * laplace(A_0) - A_0 * B_0 * B_0 + f * (1 - A_0))
 * B_1 = B_0 + dt * (d_b * laplace(B_0) + A_0 * B_0 * B_0 - (k + f) * B_0)
 * 
 * where
 *   d_a, d_b is the diffusion rate for chemicals A and B respectively
 *   f is the feed rate, the rate at which chemical A is added to the system
 *   k is the kill rate, the rate at which chemical B is removed from the system
 */

import { Vector } from "src/app/lib/vector"

export class Grid {
    data: Array<Array<[number, number]>>
    numRows: number
    numCols: number
    cellSize: number

    isWrapped: boolean = true
    dt = 1
    dA = 0.4
    dB = 0.05
    feed = 0.05
    kill = 0.05
    chemicalAColor = new Vector(0.95, 0.95, 0.95)
    chemicalBColor = new Vector(0.3, 0.3, 1.0)

    constructor(nrows: number, ncols: number, size: number, initFunc: (x: number, y: number) => [number, number] = function(x: number, y: number) { return [0, 0] }) {
        this.cellSize = size
        this.numCols = ncols
        this.numRows = nrows
        this.data = []
        for(let i = 0; i < this.numCols; i++) {
            this.data.push([])
            for(let j = 0; j < this.numRows; j++) {
                this.data[i].push(initFunc(i, j))
            }
        }
    }

    // private getWrapped(i: number, j: number): [number, number] {
    //     let x = (i + this.numCols)%this.numCols
    //     let y = (j + this.numRows)%this.numRows
    //     return this.data[x][y]
    // }

    private getWalled(i: number, j: number): [number, number] {
        if(i < 0 || i >= this.numCols || j < 0 || j >= this.numRows) {
            return [0, 0]
        } else {
            return this.data[i][j]
        }
    }

    update() {
        let newData = []
        for(let i = 0; i < this.numCols; i++) {
            newData.push([])
            for(let j = 0; j < this.numRows; j++) {
                let convRate = this.data[i][j][0]*this.data[i][j][1]*this.data[i][j][1]
                newData[i].push([0, 0])
                newData[i][j][0] = this.data[i][j][0] + this.dt *
                    (this.dA * this.laplace(0, i, j) - convRate + this.feed*(1 - this.data[i][j][0]))
                newData[i][j][1] = this.data[i][j][1] + this.dt *
                    (this.dB * this.laplace(1, i, j) + convRate - (this.kill + this.feed)*this.data[i][j][1])
            }
        }
        this.data = newData
    }

    draw(ctx: CanvasRenderingContext2D) {
        let size = this.cellSize
        for(let col = 0; col < this.numCols; col++) {
            for(let row = 0; row < this.numRows; row++) {
                let color0 = this.chemicalAColor.scale(this.data[col][row][0] * 255 * 2)
                let color1 = this.chemicalBColor.scale(this.data[col][row][1] * 255 * 2)
                let color = color0.add(color1).scale(0.5)
                ctx.fillStyle = `rgb(${Math.floor(color.x)}, ${Math.floor(color.y)}, ${Math.floor(color.z)})`
                ctx.fillRect(col*size, row*size, size, size)
            }
        }
    }

    laplace(index: number, x: number, y: number): number {
        let convolution = [
            [0.05, 0.2, 0.05],
            [0.2, -1, 0.2],
            [0.05, 0.2, 0.05]
        ]

        return this.getWalled(x-1, y-1)[index]*convolution[0][0] + this.getWalled(x, y-1)[index]*convolution[1][0] + this.getWalled(x+1, y-1)[index]*convolution[2][0] +
        this.getWalled(x-1, y)[index]*convolution[0][1] + this.getWalled(x, y)[index]*convolution[1][1] + this.getWalled(x+1, y)[index]*convolution[2][1] +
        this.getWalled(x-1, y+1)[index]*convolution[0][2] + this.getWalled(x, y+1)[index]*convolution[1][2] + this.getWalled(x+1, y+1)[index]*convolution[2][2]
    }

    lerp(u: [number, number, number], v: [number, number, number], t: number): [number, number, number] {
        return [
            u[0]*(1-t) + v[0]*t,
            u[1]*(1-t) + v[1]*t,
            u[2]*(1-t) + v[2]*t
        ]
    }
}