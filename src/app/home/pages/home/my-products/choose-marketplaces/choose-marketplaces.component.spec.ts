import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChooseMarketplacesComponent } from './choose-marketplaces.component';

describe('ChooseMarketplacesComponent', () => {
  let component: ChooseMarketplacesComponent;
  let fixture: ComponentFixture<ChooseMarketplacesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseMarketplacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseMarketplacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
