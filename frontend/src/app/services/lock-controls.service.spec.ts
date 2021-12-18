import { TestBed } from '@angular/core/testing';

import { LockControlsService } from './lock-controls.service';

describe('LockControlsService', () => {
  let service: LockControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LockControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
