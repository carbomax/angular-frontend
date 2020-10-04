import { TestBed } from '@angular/core/testing';

import { ProductsStorageUserService } from './products-storage-user.service';

describe('ProductsStorageUserService', () => {
  let service: ProductsStorageUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsStorageUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
