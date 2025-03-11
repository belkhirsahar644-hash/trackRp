import { TestBed } from '@angular/core/testing';

import { ConducteursService } from './conducteurs.service';

describe('ConducteursService', () => {
  let service: ConducteursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConducteursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
