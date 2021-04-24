import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SettingsDialogComponent } from './settings/settings-dialog/settings-dialog.component';
import { MatSliderModule } from '@angular/material/slider';
import { ColorsDialogComponent } from './colors/colors-dialog/colors-dialog.component';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { MatIconModule } from '@angular/material/icon';
import { NoiseComponent } from './components/noise/noise.component';
import { HomeComponent } from './components/home/home.component';
import { MatCardModule } from '@angular/material/card';
import { LightComponent } from './components/light/light.component';
import { BoidsComponent } from './components/boids/boids.component';
import { GameOfLifeComponent } from './components/game-of-life/game-of-life.component';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { GolColorsDialogComponent } from './components/game-of-life/gol-colors-dialog/gol-colors-dialog.component';
import { FluidSimComponent } from './components/fluid-sim/fluid-sim.component';
import { ReactionDiffusionComponent } from './components/reaction-diffusion/reaction-diffusion.component';
import { DiffLimitedAggregationComponent } from './components/diff-limited-aggregation/diff-limited-aggregation.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsDialogComponent,
    ColorsDialogComponent,
    NoiseComponent,
    HomeComponent,
    LightComponent,
    BoidsComponent,
    GameOfLifeComponent,
    GolColorsDialogComponent,
    FluidSimComponent,
    ReactionDiffusionComponent,
    DiffLimitedAggregationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSliderModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    NgxMatColorPickerModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatMenuModule
  ],
  providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
  bootstrap: [AppComponent]
})
export class AppModule { }
