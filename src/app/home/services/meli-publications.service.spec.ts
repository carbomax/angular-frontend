import { TestBed } from '@angular/core/testing';

import { MeliPublicationsService } from './meli-publications.service';

describe('MeliPublicationsService', () => {
  let service: MeliPublicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeliPublicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
