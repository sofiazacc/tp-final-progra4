import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpMapa } from './pop-up-mapa';

describe('PopUpMapa', () => {
  let component: PopUpMapa;
  let fixture: ComponentFixture<PopUpMapa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpMapa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpMapa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
