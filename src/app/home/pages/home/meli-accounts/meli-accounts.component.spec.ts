import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeliAccountsComponent } from './meli-accounts.component';

describe('MeliAccountsComponent', () => {
  let component: MeliAccountsComponent;
  let fixture: ComponentFixture<MeliAccountsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeliAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeliAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
