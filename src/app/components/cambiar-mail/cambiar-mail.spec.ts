import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarMail } from './cambiar-mail';

describe('CambiarMail', () => {
  let component: CambiarMail;
  let fixture: ComponentFixture<CambiarMail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiarMail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarMail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
