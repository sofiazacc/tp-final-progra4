import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaculadoraHorasMagicasComponent } from './caculadora-horas-magicas-component';

describe('CaculadoraHorasMagicasComponent', () => {
  let component: CaculadoraHorasMagicasComponent;
  let fixture: ComponentFixture<CaculadoraHorasMagicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaculadoraHorasMagicasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaculadoraHorasMagicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
