import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLineOrdersComponent } from './chart-line-orders.component';

describe('ChartLineOrdersComponent', () => {
  let component: ChartLineOrdersComponent;
  let fixture: ComponentFixture<ChartLineOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartLineOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartLineOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
