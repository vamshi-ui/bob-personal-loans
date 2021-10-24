import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendOtpDialogComponent } from './resend-otp-dialog.component';

describe('ResendOtpDialogComponent', () => {
  let component: ResendOtpDialogComponent;
  let fixture: ComponentFixture<ResendOtpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResendOtpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendOtpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
