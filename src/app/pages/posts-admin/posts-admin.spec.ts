import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsAdmin } from './posts-admin';

describe('PostsAdmin', () => {
  let component: PostsAdmin;
  let fixture: ComponentFixture<PostsAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
