import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoidsComponent } from './components/boids/boids.component';
import { GameOfLifeComponent } from './components/game-of-life/game-of-life.component';
import { HomeComponent } from './components/home/home.component';
import { LightComponent } from './components/light/light.component';
import { NoiseComponent } from './components/noise/noise.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'noise', component: NoiseComponent },
  { path: 'light', component: LightComponent },
  { path: 'boids', component: BoidsComponent },
  { path: 'gol', component: GameOfLifeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
