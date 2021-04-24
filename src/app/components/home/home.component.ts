import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {}

  redirectToNoise(): void {
    this.router.navigate(['/noise'])
  }

  redirectToLight(): void {
    this.router.navigate(['/light'])
  }

  redirectToBoids(): void {
    this.router.navigate(['/boids'])
  }

  redirectToGoL(): void {
    this.router.navigate(['/gol'])
  }

  redirectToFluid(): void {
    this.router.navigate(['/fluid'])
  }

  redirectToReactionDiffusion(): void {
    this.router.navigate(['/reaction-diffusion'])
  }

  redirectToDiffLimAgg(): void {
    this.router.navigate(['/diff-lim-agg'])
  }
}
