import { TestBed } from '@angular/core/testing';
import { Georer } from './georer';


describe('Georer', () => {
  let service: Georer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Georer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
