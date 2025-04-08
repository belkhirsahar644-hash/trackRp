import { TestBed } from '@angular/core/testing';

import { AddsupervieurService } from './addsupervieur.service';

describe('AddsupervieurService', () => {
  let service: AddsupervieurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddsupervieurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
