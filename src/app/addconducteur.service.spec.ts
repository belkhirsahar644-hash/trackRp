import { TestBed } from '@angular/core/testing';

import { AddconducteurService } from './addconducteur.service';

describe('AddconducteurService', () => {
  let service: AddconducteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddconducteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
