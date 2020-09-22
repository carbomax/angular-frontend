import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishMyproductsComponent } from './publish-myproducts.component';

describe('PublishMyproductsComponent', () => {
  let component: PublishMyproductsComponent;
  let fixture: ComponentFixture<PublishMyproductsComponent>;

  beforeEach(async(() => {
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
