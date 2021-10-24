import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AIPLoanDetailsComponent } from './aip-loan-details.component';

describe('AIPLoanDetailsComponent', () => {
  let component: AIPLoanDetailsComponent;
  let fixture: ComponentFixture<AIPLoanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AIPLoanDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AIPLoanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
