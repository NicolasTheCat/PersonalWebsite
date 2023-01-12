import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Citybackground3dComponent } from './citybackground3d.component';

describe('Citybackground3dComponent', () => {
  let component: Citybackground3dComponent;
  let fixture: ComponentFixture<Citybackground3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Citybackground3dComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Citybackground3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
