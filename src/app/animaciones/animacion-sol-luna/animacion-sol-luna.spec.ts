import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimacionSolLuna } from './animacion-sol-luna';

describe('AnimacionSolLuna', () => {
  let component: AnimacionSolLuna;
  let fixture: ComponentFixture<AnimacionSolLuna>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimacionSolLuna]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimacionSolLuna);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
