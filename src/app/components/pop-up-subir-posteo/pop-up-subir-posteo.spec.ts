import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpSubirPosteo } from './pop-up-subir-posteo';

describe('PopUpSubirPosteo', () => {
  let component: PopUpSubirPosteo;
  let fixture: ComponentFixture<PopUpSubirPosteo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpSubirPosteo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpSubirPosteo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
