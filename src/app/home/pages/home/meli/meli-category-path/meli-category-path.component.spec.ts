import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeliCategoryPathComponent } from './meli-category-path.component';

describe('MeliCategoryPathComponent', () => {
  let component: MeliCategoryPathComponent;
  let fixture: ComponentFixture<MeliCategoryPathComponent>;

  beforeEach(async(() => {
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
