import { TestBed } from '@angular/core/testing';

import { DeletevehiculeService } from './deletevehicule.service';

describe('DeletevehiculeService', () => {
  let service: DeletevehiculeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeletevehiculeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
