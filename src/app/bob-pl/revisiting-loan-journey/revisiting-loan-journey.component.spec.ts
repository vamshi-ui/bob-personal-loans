import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisitingLoanJourneyComponent } from './revisiting-loan-journey.component';

describe('RevisitingLoanJourneyComponent', () => {
  let component: RevisitingLoanJourneyComponent;
  let fixture: ComponentFixture<RevisitingLoanJourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisitingLoanJourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisitingLoanJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
