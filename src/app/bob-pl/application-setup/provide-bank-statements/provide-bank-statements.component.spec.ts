import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvideBankStatementsComponent } from './provide-bank-statements.component';

describe('ProvideBankStatementsComponent', () => {
  let component: ProvideBankStatementsComponent;
  let fixture: ComponentFixture<ProvideBankStatementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvideBankStatementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvideBankStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
