import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyGSTComponent } from './verify-gst.component';

describe('VerifyGSTComponent', () => {
  let component: VerifyGSTComponent;
  let fixture: ComponentFixture<VerifyGSTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyGSTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyGSTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
