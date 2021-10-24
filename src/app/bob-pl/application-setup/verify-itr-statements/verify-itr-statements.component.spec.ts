import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyItrStatementsComponent } from './verify-itr-statements.component';

describe('VerifyItrStatementsComponent', () => {
  let component: VerifyItrStatementsComponent;
  let fixture: ComponentFixture<VerifyItrStatementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyItrStatementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyItrStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
