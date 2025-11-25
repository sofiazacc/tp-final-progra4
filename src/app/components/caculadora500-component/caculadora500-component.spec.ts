import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Caculadora500Component } from './caculadora500-component';

describe('Caculadora500Component', () => {
  let component: Caculadora500Component;
  let fixture: ComponentFixture<Caculadora500Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Caculadora500Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Caculadora500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
