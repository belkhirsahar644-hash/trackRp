import { TestBed } from '@angular/core/testing';

import { DeleteConducteurService } from './delete-conducteur.service';

describe('DeleteConducteurService', () => {
  let service: DeleteConducteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteConducteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
