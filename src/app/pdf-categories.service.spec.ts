import { TestBed } from '@angular/core/testing';

import { PdfCategoriesService } from './pdf-categories.service';

describe('PdfCategoriesService', () => {
  let service: PdfCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
