import { Component, OnInit } from '@angular/core';
import { CubeControlService } from '../services/cube-control.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  is3D = false;
  isCastConnected = true;

  constructor(private cubeControlService: CubeControlService) { }

  ngOnInit(): void {
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  onEnable360() {
    this.is3D = !this.is3D;
    this.cubeControlService.onEnable360(this.is3D)
  }
}
