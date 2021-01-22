import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSellerComponent } from './dashboard-seller.component';

describe('DashboardSellerComponent', () => {
  let component: DashboardSellerComponent;
  let fixture: ComponentFixture<DashboardSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSellerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
