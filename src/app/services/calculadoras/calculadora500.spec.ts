import { TestBed } from '@angular/core/testing';

import { Calculadora500 } from './calculadora500';

describe('Calculadora500', () => {
  let service: Calculadora500;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Calculadora500);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
