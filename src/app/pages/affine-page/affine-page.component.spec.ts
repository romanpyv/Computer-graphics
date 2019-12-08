import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffinePageComponent } from './affine-page.component';

describe('AffinePageComponent', () => {
  let component: AffinePageComponent;
  let fixture: ComponentFixture<AffinePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffinePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffinePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
