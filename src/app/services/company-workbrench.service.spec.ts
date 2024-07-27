import { TestBed } from '@angular/core/testing';

import { CompanyWorkbrenchService } from './company-workbrench.service';

describe('CompanyWorkbrenchService', () => {
  let service: CompanyWorkbrenchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyWorkbrenchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
