import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HistorialOperationComponent } from './historial-operation.component';

describe('HistorialOperationComponent', () => {
  let component: HistorialOperationComponent;
  let fixture: ComponentFixture<HistorialOperationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
