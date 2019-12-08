import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorModelsPageComponent } from './color-models-page.component';

describe('ColorModelsPageComponent', () => {
  let component: ColorModelsPageComponent;
  let fixture: ComponentFixture<ColorModelsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorModelsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorModelsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
