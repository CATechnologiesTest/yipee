import { TestBed } from '@angular/core/testing';

import { TooltipService } from './tooltip.service';

describe('TooltipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TooltipService = TestBed.get(TooltipService);
    expect(service).toBeTruthy();
  });
});
