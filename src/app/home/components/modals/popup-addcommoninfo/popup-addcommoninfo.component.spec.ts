import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAddcommoninfoComponent } from './popup-addcommoninfo.component';

describe('PopupAddcommoninfoComponent', () => {
  let component: PopupAddcommoninfoComponent;
  let fixture: ComponentFixture<PopupAddcommoninfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupAddcommoninfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupAddcommoninfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
