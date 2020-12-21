import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublishedProductComponent } from './published-product.component';

describe('PublishedProductComponent', () => {
  let component: PublishedProductComponent;
  let fixture: ComponentFixture<PublishedProductComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
