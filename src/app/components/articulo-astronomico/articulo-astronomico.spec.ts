import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloAstronomico } from './articulo-astronomico';

describe('ArticuloAstronomico', () => {
  let component: ArticuloAstronomico;
  let fixture: ComponentFixture<ArticuloAstronomico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticuloAstronomico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloAstronomico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
