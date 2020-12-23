import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublishMyproductsComponent } from './publish-myproducts.component';

describe('PublishMyproductsComponent', () => {
  let component: PublishMyproductsComponent;
  let fixture: ComponentFixture<PublishMyproductsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishMyproductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishMyproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
