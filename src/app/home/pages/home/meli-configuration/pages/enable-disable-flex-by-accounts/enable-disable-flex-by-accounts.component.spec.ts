import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableDisableFlexByAccountsComponent } from './enable-disable-flex-by-accounts.component';

describe('EnableDisableFlexByAccountsComponent', () => {
  let component: EnableDisableFlexByAccountsComponent;
  let fixture: ComponentFixture<EnableDisableFlexByAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnableDisableFlexByAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableDisableFlexByAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
