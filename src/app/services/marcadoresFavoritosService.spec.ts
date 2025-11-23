import { TestBed } from '@angular/core/testing';

import { FavoritosService } from './marcadoresFavoritosService';

describe('FavoritosService', () => {
  let service: FavoritosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
