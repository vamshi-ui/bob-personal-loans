import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalInsuranceDetailsComponent } from './additional-insurance-details.component';

describe('AdditionalInsuranceDetailsComponent', () => {
  let component: AdditionalInsuranceDetailsComponent;
  let fixture: ComponentFixture<AdditionalInsuranceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalInsuranceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInsuranceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
