import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FondoGalaxia } from './fondo-galaxia';

describe('FondoGalaxia', () => {
  let component: FondoGalaxia;
  let fixture: ComponentFixture<FondoGalaxia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FondoGalaxia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FondoGalaxia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
