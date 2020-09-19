import { TestBed } from '@angular/core/testing';

import { DateFormatsService } from './date-formats.service';

describe('DateFormatsService', () => {
  let service: DateFormatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateFormatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
