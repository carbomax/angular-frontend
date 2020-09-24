import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMarketplacesComponent } from './list-marketplaces.component';

describe('ListMarketplacesComponent', () => {
  let component: ListMarketplacesComponent;
  let fixture: ComponentFixture<ListMarketplacesComponent>;

  beforeEach(async(() => {
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
