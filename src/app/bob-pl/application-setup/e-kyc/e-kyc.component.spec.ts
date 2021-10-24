import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EKycComponent } from './e-kyc.component';

describe('EKycComponent', () => {
  let component: EKycComponent;
  let fixture: ComponentFixture<EKycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EKycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
