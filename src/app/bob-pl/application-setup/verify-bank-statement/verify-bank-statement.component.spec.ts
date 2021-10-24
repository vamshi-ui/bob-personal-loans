import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyBankStatementComponent } from './verify-bank-statement.component';

describe('VerifyBankStatementComponent', () => {
  let component: VerifyBankStatementComponent;
  let fixture: ComponentFixture<VerifyBankStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyBankStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyBankStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
