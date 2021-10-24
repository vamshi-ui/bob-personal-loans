import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BureauTncComponent } from './bureau-tnc.component';

describe('BureauTncComponent', () => {
  let component: BureauTncComponent;
  let fixture: ComponentFixture<BureauTncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BureauTncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BureauTncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
