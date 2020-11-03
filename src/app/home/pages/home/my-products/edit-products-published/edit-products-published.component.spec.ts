import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductsPublishedComponent } from './edit-products-published.component';

describe('EditProductsPublishedComponent', () => {
  let component: EditProductsPublishedComponent;
  let fixture: ComponentFixture<EditProductsPublishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProductsPublishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductsPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
