import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticulosAstronomicos } from './articulos-astronomicos';

describe('ArticulosAstronomicos', () => {
  let component: ArticulosAstronomicos;
  let fixture: ComponentFixture<ArticulosAstronomicos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticulosAstronomicos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticulosAstronomicos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
