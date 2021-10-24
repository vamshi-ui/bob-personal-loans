import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadItrStatementsComponent } from './upload-itr-statements.component';

describe('UploadItrStatementsComponent', () => {
  let component: UploadItrStatementsComponent;
  let fixture: ComponentFixture<UploadItrStatementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadItrStatementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadItrStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
