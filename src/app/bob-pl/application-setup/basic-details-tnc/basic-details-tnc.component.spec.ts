import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDetailsTncComponent } from './basic-details-tnc.component';

describe('BasicDetailsTncComponent', () => {
  let component: BasicDetailsTncComponent;
  let fixture: ComponentFixture<BasicDetailsTncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicDetailsTncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDetailsTncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
