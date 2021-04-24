import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColorsDialogComponent } from 'src/app/colors/colors-dialog/colors-dialog.component';
import { NoiseSettings } from 'src/app/data/NoiseSettings';
import { ColorStop } from 'src/app/lib/colorstop';
import { Distance } from 'src/app/lib/distance';
import { Noise } from 'src/app/lib/noise';
import { Vector } from 'src/app/lib/vector';
import { SettingsDialogComponent } from 'src/app/settings/settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-noise',
  templateUrl: './noise.component.html',
  styleUrls: ['./noise.component.css']
})
export class NoiseComponent implements OnInit {
  title = 'NoiseScript'
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  pts: Vector[]
  isDrawing: Boolean = false
  settings: NoiseSettings = {
    lacunarity: 2,
    persistence: 0.5,
    octaves: 5,
    selectedDistance: "euclid",
    seed: 1912,
    blockSize: 20,
    selectedNoise: "fractal"
  }
  
  colors: ColorStop[] = Array(
    new ColorStop(0.0, 0.0, 0.0, 0.0),
    new ColorStop(255.0, 255.0, 255.0, 1.0))
    
  constructor(public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.canvas = document.getElementsByTagName("canvas")[0]
    this.ctx = this.canvas.getContext('2d')
    this.pts = this.initializePoints()
    this.draw()
  }

  goHome(): void {
    this.router.navigate([''])
  }

  openSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '500px',
      data: this.settings
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.settings = result
        this.pts = this.initializePoints()
        this.draw()
      }
    });
  }

  openColorsDialog(): void {
    const dialogRef = this.dialog.open(ColorsDialogComponent, {
      width: '500px',
      data: {hexColor: "#000000", stop: 0}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.colors.push(ColorStop.fromHex(result.hexColor, result.stop))
        this.colors.sort((x, y) => x.stop - y.stop)
        this.pts = this.initializePoints()
        this.draw()
      }
    });
  }

  sortedPoints(v: Vector): number[] {
    let res: number[] = []
    let dist = new Distance()
    for(let i = 0; i < this.pts.length; i++) {
      let d = dist.getDistance(this.settings.selectedDistance)(this.pts[i], v)
      res.push(d)
    }
    return res.sort((x, y) => x - y)
  }

  initializePoints(): Vector[] {
    let pts = []
    let k = Math.floor(this.canvas.width/this.settings.blockSize)
    let h = Math.floor(this.canvas.height/this.settings.blockSize)
    for(let i = -1; i < k; i++) {
      for(let j = -1; j < h; j++) {
        pts.push(new Vector((Math.random() + i)*this.settings.blockSize, (Math.random() + j)*this.settings.blockSize))
      }
    }
    return pts;
  }

  private lerp(col1: ColorStop, col2: ColorStop, t: number): number[] {
    let p = (t - col1.stop)/(col2.stop - col1.stop)
    return Array(
      col1.red*(1 - p) + col2.red*p,
      col1.green*(1 - p) + col2.green*p,
      col1.blue*(1 - p) + col2.blue*p
    )
  }

  getColor(col: number): number[] {
    for(let i = 0; i < this.colors.length; i++) {
      if(col > this.colors[i].stop && col < this.colors[i+1].stop) {
        return this.lerp(this.colors[i], this.colors[i+1], col)
      }
    }
    return null
  }

  updatePixel(i: number, j: number): number[] {
    let c = 0
    let noise = new Noise()
    if(this.settings.selectedNoise === "value") {
      c = noise.valueNoise(new Vector(i/this.settings.blockSize, j/this.settings.blockSize), this.settings.seed)
    } else if(this.settings.selectedNoise === "fractal") {
      let n = noise.fractalNoise(+this.settings.persistence, +this.settings.lacunarity, this.settings.octaves, this.settings.seed)
      c = n(new Vector((i + 0.5)/this.settings.blockSize, (j + 0.5)/this.settings.blockSize))
    } else if(this.settings.selectedNoise === "worley") {
      let d1 = this.sortedPoints(new Vector(i+0.5, j+0.5))
      c = d1[0]/d1[1]
    } else if(this.settings.selectedNoise === "ridged") {
      let n = noise.fractalNoiseWith(x => Math.abs(x*2 - 1), +this.settings.persistence, +this.settings.lacunarity, this.settings.octaves, this.settings.seed)
      c = n(new Vector((i + 0.5)/this.settings.blockSize, (j + 0.5)/this.settings.blockSize))
    }
    return this.getColor(c)
  }

  draw() {
    this.isDrawing = true
    let i = 0
    let interval = setInterval(() => {
      for(let j = 0; j < this.canvas.height; j++) {
        let col = this.updatePixel(i, j)
        this.ctx.fillStyle = "rgb(" + col[0].toFixed(0) + "," + col[1].toFixed(0) + "," + col[2].toFixed(0) + ")"
        this.ctx.fillRect(i, j, 1, 1)
      }
      i++
      if(i >= this.canvas.width) {
        this.isDrawing = false
        clearInterval(interval)
      }
    })
  }

  delete(col: ColorStop) {
    let i = this.colors.indexOf(col)
    this.colors.splice(i, 1)
    this.draw()
  }

  download(name: string) {
    var xhr = new XMLHttpRequest();
    var c = document.createElement('canvas')
    c.width = this.canvas.width*4
    c.height = this.canvas.height*4
    c.getContext('2d').drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width*4, this.canvas.height*4)
    xhr.open('GET', c.toDataURL('image/png'), true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = name;
        tag.click();
    }
    xhr.send();
  }
}
