import { TestBed } from '@angular/core/testing';

import { MerriamWebsterService } from './merriam-webster.service';

describe('MerriamWebsterService', () => {
  let service: MerriamWebsterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerriamWebsterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
