import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMarketplacesComponent } from './list-marketplaces.component';

describe('ListMarketplacesComponent', () => {
  let component: ListMarketplacesComponent;
  let fixture: ComponentFixture<ListMarketplacesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMarketplacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMarketplacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
