import { TestBed } from '@angular/core/testing';

import { CanvasManagementService } from './canvas-management.service';

describe('CanvasManagmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanvasManagementService = TestBed.get(CanvasManagementService);
    expect(service).toBeTruthy();
  });
});
