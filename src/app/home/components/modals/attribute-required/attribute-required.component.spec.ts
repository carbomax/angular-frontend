import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttributeRequiredComponent } from './attribute-required.component';

describe('AttributeRequiredComponent', () => {
  let component: AttributeRequiredComponent;
  let fixture: ComponentFixture<AttributeRequiredComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeRequiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
