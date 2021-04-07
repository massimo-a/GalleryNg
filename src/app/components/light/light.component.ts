import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Line } from 'src/app/components/light/Line';
import { Vector } from 'src/app/lib/vector';
import { Ray } from './ray';

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.css']
})
export class LightComponent implements OnInit {
  wallsOn: Boolean = true
  walls: Array<Line> = []
  player: Vector = new Vector(650, 300)
  title = "Light2D"
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  ms: number
  isPaused: Boolean = false
  measuringFps: Boolean = true
  width: number = 1300
  height: number = 600
  rays: Array<Ray> = []

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.canvas = document.getElementsByTagName("canvas")[0]
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = this.width
    this.canvas.height = this.height
    for(let i = 0; i < 4*Math.PI; i = i + Math.PI/32) {
      this.rays.push(new Ray(this.player, i))
    }

    this.ms = 0
		let t = new Date().getTime()

    setInterval(() => {
      if(!this.isPaused) {
        this.update()
        this.draw()
        this.ms = new Date().getTime() - t
        t = new Date().getTime()
      }
    }, 25)
  }

  goHome(): void {
    this.router.navigate([''])
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.fillStyle = '#323232'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.beginPath()
    this.ctx.arc(this.player.x, this.player.y, 10, 0, 2*Math.PI)
    this.ctx.fill()
    this.rays.forEach(x => x.draw(this.ctx))
  }

  update() {
    
  }
}
