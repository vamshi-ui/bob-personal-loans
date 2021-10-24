import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreApprovedLoanComponent } from './pre-approved-loan.component';

describe('PreApprovedLoanComponent', () => {
  let component: PreApprovedLoanComponent;
  let fixture: ComponentFixture<PreApprovedLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreApprovedLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreApprovedLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
