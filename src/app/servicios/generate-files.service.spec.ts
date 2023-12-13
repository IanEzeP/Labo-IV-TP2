import { TestBed } from '@angular/core/testing';

import { GenerateFilesService } from './generate-files.service';

describe('GenerateFilesService', () => {
  let service: GenerateFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
