import { TestBed } from '@angular/core/testing';

import { DeleteSuperviseurService } from './delete-superviseur.service';

describe('DeleteSuperviseurService', () => {
  let service: DeleteSuperviseurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteSuperviseurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
