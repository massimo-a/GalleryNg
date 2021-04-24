import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/app/lib/game';
import { Vector } from 'src/app/lib/vector';
import { RandomWalker } from './RandomWalker';

@Component({
  selector: 'app-diff-limited-aggregation',
  templateUrl: './diff-limited-aggregation.component.html',
  styleUrls: ['./diff-limited-aggregation.component.css']
})
export class DiffLimitedAggregationComponent extends Game implements OnInit {
  title = 'Diffusion Limited Aggregation'
  aggregate = []
  walkers = []
  maxAggregateSize = 750
  initNumberOfWalkers = 250
  timeStep = 100

  constructor(private router: Router) {
    super()
  }

  update(): void {
    for(let j = 0; j < this.timeStep; j++) {
      this.walkers.forEach(w => w.update(new Vector(this.settings.width, this.settings.height)))
      for(let i = 0; i < this.walkers.length; i++) {
        let hit = this.walkers[i].intersection(this.aggregate)
        if(hit) {
          this.aggregate.push(this.walkers[i])
          if(this.aggregate.length < this.maxAggregateSize) {
            this.walkers[i] = new RandomWalker(new Vector(Math.random()*this.settings.width, Math.random()*this.settings.height))
          } else {
            this.togglePause()
            this.walkers = []
          }
        }
      }
    }
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.settings.width, this.settings.height)
    this.ctx.fillStyle = '#A3A3A3'
    this.ctx.fillRect(0, 0, this.settings.width, this.settings.height)
    this.aggregate.forEach(walker => walker.draw(this.ctx, (p: Vector) => {
      let radialColor = Math.atan2(p.y - this.settings.height, p.x - this.settings.width) + Math.PI
      return new Vector(p.y/this.settings.height, radialColor/(2*Math.PI), p.x/this.settings.width)
    }))
    this.walkers.forEach(walker => walker.draw(this.ctx))
  }

  ngOnInit(): void {
    this.init()
    for(let i = 0; i < this.initNumberOfWalkers; i++) {
      this.walkers.push(new RandomWalker(new Vector(Math.random()*this.settings.width, Math.random()*this.settings.height)))
    }
    this.aggregate = [new RandomWalker(new Vector(this.settings.width/2, this.settings.height/2))]
    console.log(this.settings.width, this.settings.height)
    this.run()
  }

  goHome(): void {
    this.router.navigate([''])
  }

  clickedGrid(event: MouseEvent) {
    let rect = this.canvas.getBoundingClientRect()
    let i = Math.floor((event.clientX - rect.left)/this.settings.cellSize)
    let j = Math.floor((event.clientY - rect.top)/this.settings.cellSize)
    
    this.draw()
  }
}
