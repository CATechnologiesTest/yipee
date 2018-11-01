import { TestBed, async, inject } from '@angular/core/testing';

import { CanDeactivateGuard } from './can-deactivate.guard';

describe('CanDeactivateGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateGuard]
    });
  });

  it('should ...', inject([CanDeactivateGuard], (guard: CanDeactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
