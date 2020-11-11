import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseMarketplacesComponent } from './choose-marketplaces.component';

describe('ChooseMarketplacesComponent', () => {
  let component: ChooseMarketplacesComponent;
  let fixture: ComponentFixture<ChooseMarketplacesComponent>;

  beforeEach(async(() => {
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
