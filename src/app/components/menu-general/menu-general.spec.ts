import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGeneral } from './menu-general';

describe('MenuGeneral', () => {
  let component: MenuGeneral;
  let fixture: ComponentFixture<MenuGeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuGeneral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuGeneral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
