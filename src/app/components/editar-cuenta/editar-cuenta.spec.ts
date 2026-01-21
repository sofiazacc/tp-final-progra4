import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCuenta } from './editar-cuenta';

describe('EditarCuenta', () => {
  let component: EditarCuenta;
  let fixture: ComponentFixture<EditarCuenta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCuenta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCuenta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
