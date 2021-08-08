import { TestBed } from '@angular/core/testing';

import { IconDetailService } from './icon-detail.service';

describe('IconDetailService', () => {
  let service: IconDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
