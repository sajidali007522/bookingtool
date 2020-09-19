import { TestBed } from '@angular/core/testing';

import { HouseKeepingService } from './house-keeping.service';

describe('HouseKeepingService', () => {
  let service: HouseKeepingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HouseKeepingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
