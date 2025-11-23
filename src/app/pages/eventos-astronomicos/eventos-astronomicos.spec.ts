import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosAstronomicos } from './eventos-astronomicos';

describe('EventosAstronomicos', () => {
  let component: EventosAstronomicos;
  let fixture: ComponentFixture<EventosAstronomicos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosAstronomicos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosAstronomicos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
