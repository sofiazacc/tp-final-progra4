import { TestBed } from '@angular/core/testing';

import { CalculadoraHorasMagicas } from './calculadora-horas-magicas';

describe('CalculadoraHorasMagicas', () => {
  let service: CalculadoraHorasMagicas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculadoraHorasMagicas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
