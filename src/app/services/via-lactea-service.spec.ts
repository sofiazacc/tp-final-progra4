import { TestBed } from '@angular/core/testing';
import { ViaLacteaServiceService } from './via-lactea-service';


describe('ViaLacteaService', () => {
  let service: ViaLacteaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViaLacteaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
