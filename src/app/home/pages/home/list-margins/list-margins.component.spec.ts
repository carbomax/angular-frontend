import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMarginsComponent } from './list-margins.component';

describe('ListMarginsComponent', () => {
  let component: ListMarginsComponent;
  let fixture: ComponentFixture<ListMarginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMarginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMarginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
