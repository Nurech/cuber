import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreePlayComponent } from './free-play.component';

describe('FreePlayComponent', () => {
  let component: FreePlayComponent;
  let fixture: ComponentFixture<FreePlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreePlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
