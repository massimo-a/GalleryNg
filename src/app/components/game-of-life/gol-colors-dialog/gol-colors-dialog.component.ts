import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorInput } from './ColorInput';

@Component({
  selector: 'app-gol-colors-dialog',
  templateUrl: './gol-colors-dialog.component.html',
  styleUrls: ['./gol-colors-dialog.component.css']
})
export class GolColorsDialogComponent implements OnInit {
  colorControlOn: AbstractControl = new FormControl(null)
  colorControlOff: AbstractControl = new FormControl(null)

  constructor(
    public dialogRef: MatDialogRef<GolColorsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ColorInput) {}

  ngOnInit(): void {
  }

  updateColor(): void {
    this.data.onColorHex = this.colorControlOn.value?.hex
    this.data.offColorHex = this.colorControlOff.value?.hex
  }
}
