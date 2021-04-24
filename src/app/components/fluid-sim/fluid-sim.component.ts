import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vector } from 'src/app/lib/vector';
import { Fluid } from './fluid';

@Component({
  selector: 'app-fluid-sim',
  templateUrl: './fluid-sim.component.html',
  styleUrls: ['./fluid-sim.component.css']
})
export class FluidSimComponent implements OnInit {
  title = '2D Fluid Simulation'
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  ms: number = 0
  measuringFps: Boolean = true
  size: number = 512
  cellSize: number = 4
  numCells = parseInt((this.size/this.cellSize).toFixed(0))
  fluid: Fluid;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = this.size
    this.canvas.height = this.size
		let t = new Date().getTime()

    this.fluid = new Fluid(this.size, this.cellSize, 0.001, 0.001)

    setInterval(() => {
      this.update()
      this.draw()
      this.ms = new Date().getTime() - t
      t = new Date().getTime()
    }, 100)
  }

  goHome(): void {
    this.router.navigate([''])
  }

  draw() {
    this.ctx.clearRect(0, 0, this.size, this.size)
    this.ctx.fillStyle = 'rgb(64, 64, 64)'
    this.ctx.fillRect(0, 0, this.size, this.size)
    this.fluid.draw(this.ctx)
  }

  update() {
    this.fluid.step()
  }

  clickedGrid(e: MouseEvent) {
    let rect = this.canvas.getBoundingClientRect()
    let mouseX = Math.floor((e.clientX - rect.left)/this.cellSize)
    let mouseY = Math.floor((e.clientY - rect.top)/this.cellSize)
    for(let i = mouseX - 5; i < mouseX + 5; i++) {
      for(let j = mouseY - 5; j < mouseY + 5; j++) {
        if((i - mouseX)*(i - mouseX) + (j - mouseY)*(j - mouseY) <= 25) {
          this.fluid.addDye(i, j, 1000)
          let angle = Math.random()*Math.PI*2
          this.fluid.addVelocity(i, j, new Vector(Math.cos(angle)*100, Math.sin(angle)*1000))
          this.fluid.addVelocity(i, j, new Vector(0, 25))
        }
      }
    }
  }
}
