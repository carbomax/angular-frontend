import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLineOrdersSellersComponent } from './chart-line-orders-sellers.component';

describe('ChartLineOrdersSellersComponent', () => {
  let component: ChartLineOrdersSellersComponent;
  let fixture: ComponentFixture<ChartLineOrdersSellersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartLineOrdersSellersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartLineOrdersSellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
