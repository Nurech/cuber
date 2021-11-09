import { TestBed } from '@angular/core/testing';

import { CubeControlService } from './cube-control.service';

describe('CubeControlService', () => {
  let service: CubeControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CubeControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
