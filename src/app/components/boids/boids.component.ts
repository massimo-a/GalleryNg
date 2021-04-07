import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vector } from 'src/app/lib/vector';
import { BoidPopulation } from './Boid';
import { BoidSettings } from './BoidSettings';
import { Obstacle } from './Obstacle';

@Component({
  selector: 'app-boids',
  templateUrl: './boids.component.html',
  styleUrls: ['./boids.component.css']
})
export class BoidsComponent implements OnInit {
  title = "Boids"
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  ms: number
  boidPopulation: BoidPopulation
  isPaused: Boolean = false
  hasLines: Boolean = true
  measuringFps: Boolean = true
  obstacles: Array<Obstacle> = [new Obstacle(new Vector(650, 300), 50)]

  settings: BoidSettings = {
    width: 1300,
    height: 600,
    separation: 0.03,
    alignment: 0.05,
    cohesion: 0.01,
    speed: 3,
    populationSize: 100
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.boidPopulation = new BoidPopulation(this.settings, this.obstacles)
    this.canvas = document.getElementsByTagName("canvas")[0]
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = this.settings.width
    this.canvas.height = this.settings.height

    this.ms = 0
		let t = new Date().getTime()

    setInterval(() => {
      if(!this.isPaused) {
        this.boidPopulation.update()
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
    this.ctx.clearRect(0, 0, this.settings.width, this.settings.height)
    this.ctx.fillStyle = 'rgb(50, 50, 50)'
    this.ctx.fillRect(0, 0, this.settings.width, this.settings.height)
    this.boidPopulation.draw(this.ctx, this.hasLines)
  }
}
