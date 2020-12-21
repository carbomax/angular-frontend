import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeliCategoryPathComponent } from './meli-category-path.component';

describe('MeliCategoryPathComponent', () => {
  let component: MeliCategoryPathComponent;
  let fixture: ComponentFixture<MeliCategoryPathComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeliCategoryPathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeliCategoryPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
