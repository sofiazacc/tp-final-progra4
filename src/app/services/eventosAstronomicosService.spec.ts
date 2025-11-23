import { TestBed } from '@angular/core/testing';

import { EventosAstronomicosService } from './eventosAstronomicosService';

describe('EventosAstronomicosService', () => {
  let service: EventosAstronomicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventosAstronomicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
