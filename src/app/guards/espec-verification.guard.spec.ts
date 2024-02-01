import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { especVerificationGuard } from './espec-verification.guard';

describe('especVerificationGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => especVerificationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
