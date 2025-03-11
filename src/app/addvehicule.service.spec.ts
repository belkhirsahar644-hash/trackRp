import { TestBed } from '@angular/core/testing';

import { AddvehiculeService } from './addvehicule.service';

describe('AddvehiculeService', () => {
  let service: AddvehiculeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddvehiculeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
