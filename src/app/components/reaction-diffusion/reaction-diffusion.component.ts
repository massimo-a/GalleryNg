import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Grid } from './Grid';
import { Game } from '../../lib/game'
import { Vector } from 'src/app/lib/vector';

@Component({
  selector: 'app-reaction-diffusion',
  templateUrl: './reaction-diffusion.component.html',
  styleUrls: ['./reaction-diffusion.component.css']
})
export class ReactionDiffusionComponent extends Game implements OnInit {
  title = 'Reaction Diffusion'
  grid: Grid;

  constructor(private router: Router) {
    super()
  }

  update(): void {
    this.grid.update()
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.settings.width, this.settings.height)
    this.ctx.fillStyle = '#A3A3A3'
    this.ctx.fillRect(0, 0, this.settings.width, this.settings.height)
    this.grid.draw(this.ctx)
  }

  ngOnInit(): void {
    this.init()
    let p = [30, 30, 10]
    this.grid = new Grid(this.numRows, this.numColumns, this.settings.cellSize, (x, y) => {
      if((x - p[0])*(x - p[0]) + (y - p[1])*(y - p[1]) < p[2]*p[2]) {
        return [0, 1]
      } else {
        return [1, 0]
      }
    })
    this.run()
  }

  goHome(): void {
    this.router.navigate([''])
  }

  clickedGrid(event: MouseEvent) {
    let rect = this.canvas.getBoundingClientRect()
    let i = Math.floor((event.clientX - rect.left)/this.settings.cellSize)
    let j = Math.floor((event.clientY - rect.top)/this.settings.cellSize)
    for(let x = i - 5; x < i + 5; x++) {
      for(let y = j - 5; y < j + 5; y++) {
        if((x - i)*(x - i) + (y - j)*(y - j) < 25) {
          let xcheck = Math.min(Math.max(x, 0), this.numColumns - 1)
          let ycheck = Math.min(Math.max(y, 0), this.numRows - 1)
          this.grid.data[xcheck][ycheck] = [0, 1]
        }
      }
    }
    this.draw()
  }
}
