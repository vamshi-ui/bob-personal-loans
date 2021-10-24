import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBankStatementComponent } from './upload-bank-statement.component';

describe('UploadBankStatementComponent', () => {
  let component: UploadBankStatementComponent;
  let fixture: ComponentFixture<UploadBankStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBankStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBankStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
