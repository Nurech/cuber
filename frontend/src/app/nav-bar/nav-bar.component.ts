import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CubeControlService } from '../services/cube-control.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isLiveSolving = true;

  constructor(private cubeControlService: CubeControlService) { }

  ngOnInit(): void {
  }

  onTabChange(event: MatTabChangeEvent) {
    console.log(event)
    this.cubeControlService.getSolution()
    // this.cubeControlService.cube.showFaceLabels();
    this.cubeControlService.userOnTab.next(event.index)
  }
}
