import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.css']
})
export class LightComponent implements OnInit {
  wallsOn: Boolean = true

  constructor(private router: Router) { }

  ngOnInit(): void {}

  goHome(): void {
    this.router.navigate([''])
  }

}
