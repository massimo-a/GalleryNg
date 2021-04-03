import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorInput } from 'src/app/data/ColorInput';

@Component({
  selector: 'app-colors-dialog',
  templateUrl: './colors-dialog.component.html',
  styleUrls: ['./colors-dialog.component.css']
})
export class ColorsDialogComponent implements OnInit {
  colorControl: AbstractControl = new FormControl(null)

  constructor(
    public dialogRef: MatDialogRef<ColorsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ColorInput) {}

  ngOnInit(): void {
  }

  updateColor(): void {
    this.data.hexColor = this.colorControl.value?.hex
  }
}
