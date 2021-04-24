import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoidsComponent } from './components/boids/boids.component';
import { DiffLimitedAggregationComponent } from './components/diff-limited-aggregation/diff-limited-aggregation.component';
import { FluidSimComponent } from './components/fluid-sim/fluid-sim.component';
import { GameOfLifeComponent } from './components/game-of-life/game-of-life.component';
import { HomeComponent } from './components/home/home.component';
import { LightComponent } from './components/light/light.component';
import { NoiseComponent } from './components/noise/noise.component';
import { ReactionDiffusionComponent } from './components/reaction-diffusion/reaction-diffusion.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'noise', component: NoiseComponent },
  { path: 'light', component: LightComponent },
  { path: 'boids', component: BoidsComponent },
  { path: 'gol', component: GameOfLifeComponent },
  { path: 'fluid', component: FluidSimComponent },
  { path: 'reaction-diffusion', component: ReactionDiffusionComponent },
  { path: 'diff-lim-agg', component: DiffLimitedAggregationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
