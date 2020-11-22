import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeRequiredComponent } from './attribute-required.component';

describe('AttributeRequiredComponent', () => {
  let component: AttributeRequiredComponent;
  let fixture: ComponentFixture<AttributeRequiredComponent>;

  beforeEach(async(() => {
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
