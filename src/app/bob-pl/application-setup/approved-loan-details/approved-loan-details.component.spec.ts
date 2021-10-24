import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedLoanDetailsComponent } from './approved-loan-details.component';

describe('ApprovedLoanDetailsComponent', () => {
  let component: ApprovedLoanDetailsComponent;
  let fixture: ComponentFixture<ApprovedLoanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedLoanDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedLoanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
