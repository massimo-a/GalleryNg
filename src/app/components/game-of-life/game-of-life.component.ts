import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GolColorsDialogComponent } from './gol-colors-dialog/gol-colors-dialog.component';
import { GolSettings } from './GolSettings';
import { Grid } from './Grid';

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.css']
})

export class GameOfLifeComponent implements OnInit {
  title = "Game of Life"
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  ms: number

  isPaused: Boolean = false
  hasGrid: Boolean = true
  measuringFps: Boolean = true
  isSquare: Boolean = true
  spawnChance: number = 0.5
  isWrapped: boolean = true

  settings: GolSettings = {
    width: 1300,
    height: 600,
    cellSize: 25,
    onColor: "#3232FF",
    offColor: "#323232",
  }

  numRows = this.settings.width/this.settings.cellSize
  numCols = this.settings.height/this.settings.cellSize
  grid: Grid

  constructor(public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.canvas = document.getElementsByTagName("canvas")[0]
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = this.settings.width
    this.canvas.height = this.settings.height

    let _this = this
    this.grid  = new Grid(this.settings, (x, y) => {
      return Math.random() < _this.spawnChance ? 1 : 0
    })

    this.ms = 0
		let t = new Date().getTime()

    setInterval(() => {
      if(!this.isPaused) {
        this.grid.update()
        this.draw()
        this.ms = new Date().getTime() - t
        t = new Date().getTime()
      }
    }, 50)
  }

  draw() {
    this.ctx.clearRect(0, 0, this.settings.width, this.settings.height)
    this.ctx.fillStyle = "rgb(64, 64, 64)"
    this.ctx.fillRect(0, 0, this.settings.width, this.settings.height)
    this.grid.draw(this.ctx, this.hasGrid, this.isSquare, this.settings.onColor, this.settings.offColor)
  }

  randomize() {
    this.grid.randomize(this.spawnChance)
    this.draw()
  }

  step() {
    this.grid.update()
    this.draw()
  }

  toggleGrid() {
    this.hasGrid = !this.hasGrid
    this.draw()
  }

  changeStyle() {
    this.isSquare = !this.isSquare
    this.draw()
  }

  changeEdges() {
    this.isWrapped = !this.isWrapped
    this.grid.changeEdges()
    this.draw()
  }

  openColorsDialog(): void {
    const dialogRef = this.dialog.open(GolColorsDialogComponent, {
      width: '500px',
      data: {hexColorOn: "#FFFFFF", hexColorOff: "#000000"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.settings.onColor = "#" + result.onColorHex
        this.settings.offColor = "#" + result.offColorHex
        this.draw()
      }
    });
  }

  goHome(): void {
    this.router.navigate([''])
  }

  clickedGrid(event: MouseEvent) {
    let rect = this.canvas.getBoundingClientRect()
    let i = Math.floor((event.clientX - rect.left)/this.settings.cellSize)
    let j = Math.floor((event.clientY - rect.top)/this.settings.cellSize)
    this.grid.data[i][j] = (this.grid.data[i][j] + 1)%2
    this.draw()
  }

  zeroOut() {
    this.grid.zero()
    this.draw()
  }

  loadGosperGlider() {
    this.grid.loadGosperGlider()
    this.draw()
  }

  loadBloomingFlower() {
    this.grid.loadBloomingFlower()
    this.draw()
  }

  load101() {
    this.grid.load101()
    this.draw()
  }

  load25P3H1V01() {
    this.grid.load25P3H1V01()
    this.draw()
  }

  consoleLogState() {
    console.log(this.grid.saveState())
  }
}
