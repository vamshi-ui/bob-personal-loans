import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvideGstStatementsComponent } from './provide-gst-statements.component';

describe('ProvideGstStatementsComponent', () => {
  let component: ProvideGstStatementsComponent;
  let fixture: ComponentFixture<ProvideGstStatementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvideGstStatementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvideGstStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
