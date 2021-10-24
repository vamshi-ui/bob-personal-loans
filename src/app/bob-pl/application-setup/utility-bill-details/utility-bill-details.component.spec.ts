import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityBillDetailsComponent } from './utility-bill-details.component';

describe('UtilityBillDetailsComponent', () => {
  let component: UtilityBillDetailsComponent;
  let fixture: ComponentFixture<UtilityBillDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilityBillDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilityBillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
