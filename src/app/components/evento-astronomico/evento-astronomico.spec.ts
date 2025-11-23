import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoAstronomicoComponente } from './evento-astronomico';

describe('EventoAstronomicoComponente', () => {
  let component: EventoAstronomicoComponente;
  let fixture: ComponentFixture<EventoAstronomicoComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventoAstronomicoComponente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventoAstronomicoComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
