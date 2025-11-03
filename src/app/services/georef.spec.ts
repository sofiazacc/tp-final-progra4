import { TestBed } from '@angular/core/testing';
import { GeorefService } from './georef';


describe('GeorefService', () => {
  let service: GeorefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeorefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
