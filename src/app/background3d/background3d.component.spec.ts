import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Background3dComponent } from './background3d.component';

describe('Background3dComponent', () => {
  let component: Background3dComponent;
  let fixture: ComponentFixture<Background3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Background3dComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Background3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
