import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FractalPageComponent } from './fractal-page.component';

describe('FractalPageComponent', () => {
  let component: FractalPageComponent;
  let fixture: ComponentFixture<FractalPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FractalPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FractalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
