import { GolSettings } from "./GolSettings"

export class Grid {
    width: number
    height: number
    data: Array<Array<number>>
    numRows: number
    numCols: number
    cellSize: number

    survive: Array<number> = [2, 3]
    birth: Array<number> = [3]
    isWrapped: boolean = true

    constructor(settings: GolSettings, initFunc: (x: number, y: number) => number = function(x: number, y: number) { return 0 }) {
        this.width = settings.width
        this.height = settings.height
        this.cellSize = settings.cellSize
        this.numCols = this.width/this.cellSize
        this.numRows = this.height/this.cellSize
        this.data = []
        for(let i = 0; i < this.numCols; i++) {
            this.data.push([])
            for(let j = 0; j < this.numRows; j++) {
                this.data[i].push(initFunc(i, j))
            }
        }
    }

    private getWrapped(i: number, j: number): number {
        let x = (i + this.numCols)%this.numCols
        let y = (j + this.numRows)%this.numRows
        return this.data[x][y]
    }

    private getWalled(i: number, j: number): number {
        if(i < 0 || i >= this.numCols || j < 0 || j >= this.numRows) {
            return 0
        } else {
            return this.data[i][j]
        }
    }

    sumNeighbors(i: number, j: number) {
        if(this.isWrapped) {
            return this.getWrapped(i-1, j-1) + this.getWrapped(i, j-1) + this.getWrapped(i+1, j-1)
                + this.getWrapped(i-1, j) + this.getWrapped(i+1, j)
                + this.getWrapped(i-1, j+1) + this.getWrapped(i, j+1) + this.getWrapped(i+1, j+1)
        } else {
            return this.getWalled(i-1, j-1) + this.getWalled(i, j-1) + this.getWalled(i+1, j-1)
                + this.getWalled(i-1, j) + this.getWalled(i+1, j)
                + this.getWalled(i-1, j+1) + this.getWalled(i, j+1) + this.getWalled(i+1, j+1)
        }
    }

    update() {
        let newData = []
        for(let i = 0; i < this.numCols; i++) {
            newData.push([])
            for(let j = 0; j < this.numRows; j++) {
                let sum = this.sumNeighbors(i, j)
                if(this.data[i][j] == 1 && this.survive.includes(sum)) {
                    newData[i].push(1)
                } else if(this.data[i][j] == 0 && this.birth.includes(sum)) {
                    newData[i].push(1)
                } else {
                    newData[i].push(0)
                }
            }
        }
        this.data = newData
    }

    draw(ctx: CanvasRenderingContext2D, hasGrid: Boolean, isSquare: Boolean, on: string, off: string) {
        let size = this.cellSize
        for(let col = 0; col < this.numCols; col++) {
            for(let row = 0; row < this.numRows; row++) {
                ctx.fillStyle = this.data[col][row] == 1 ? on : off
                if(isSquare) {
                    ctx.fillRect(col*size, row*size, size, size)
                } else {
                    ctx.beginPath()
                    ctx.arc((col + 1/2)*size, (row + 1/2)*size, size/2, 0, 2*Math.PI)
                    ctx.fill()
                }

                if(hasGrid) {
                    ctx.strokeRect(col*size, row*size, size, size)
                }
            }
        }
    }

    randomize(p: number) {
        this.data = []
        for(let i = 0; i < this.numCols; i++) {
            this.data.push([])
            for(let j = 0; j < this.numRows; j++) {
                this.data[i].push(Math.random() < p ? 1 : 0)
            }
        }
    }

    zero() {
        this.data = []
        for(let i = 0; i < this.numCols; i++) {
            this.data.push([])
            for(let j = 0; j < this.numRows; j++) {
                this.data[i].push(0)
            }
        }
    }

    changeEdges() {
        this.isWrapped = !this.isWrapped
    }

    loadGosperGlider() {
        this.loadState(
            "0c00000c00000000000000000000000000000000000000000000000000000e0000110000208000208000040000" +
            "1100000e0000040000000000000000380000380000440000000000c60000000000000000000000000000000000" +
            "000000000000000000000000300000300000000000000000000000000000000000000000000000000000000000" +
            "000000000000000000000000000000000000000000")
    }

    load101() {
        this.loadState(
            "1980001980000000007fe000801000cf3000000000060000090000090000060000000000" +
            "cf30008010007fe000000000198000198000000000000000000000000000000000000000" +
            "000000000000000000000000000000000000000000000000000000000000000000000000" +
            "000000000000000000000000000000000000000000000000000000000000000000000000" +
            "000000000000000000000000")
    }

    load25P3H1V01() {
        this.loadState(
            "000000080000140000140000100000300000280000000000700000500000280000600000" +
            "000000200000280000280000100000000000000000000000000000000000000000000000" +
            "000000000000000000000000000000000000000000000000000000000000000000000000" +
            "000000000000000000000000000000000000000000000000000000000000000000000000" +
            "000000000000000000000000")
    }

    loadBloomingFlower() {
        this.loadState(
            "000000000000000000000000000000000000010000028000028000010000000000038000" +
            "000000000000000000000000000000000000000000000000000000000000000000000000" +
            "000000000000000000000000000000000000000000000000000000000000000000000000" +
            "000000000000000000000000000000000000000000000000000000000000000000000000" +
            "000000000000000000000000")
    }

    saveState(): string {
        console.log(this.data)
        return this.data
            .map(x => x.reduce((accu, curr) => accu + curr, ""))
            .map(x => parseInt(x, 2).toString(16).padStart(6, "0"))
            .reduce((accu, curr) => accu + curr, "")
    }

    loadState(state: string) {
        let hexPiece = state.slice(0, 6)
        let theRest = state.slice(6)
        let arr = [hexPiece]
        while(theRest.length > 0) {
            hexPiece = theRest.slice(0, 6)
            theRest = theRest.slice(6)
            arr.push(hexPiece)
        }
        let bin = arr
            .map(x => parseInt(x, 16).toString(2).padStart(this.numRows, "0").split(""))
            .map(x => x.map(y => parseInt(y, 2)))
        this.data = bin
    }
}