import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosicionViaLactea } from './posicion-via-lactea';

describe('PosicionViaLactea', () => {
  let component: PosicionViaLactea;
  let fixture: ComponentFixture<PosicionViaLactea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosicionViaLactea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosicionViaLactea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
