import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankyouDetailsComponent } from './thankyou-details.component';

describe('ThankyouDetailsComponent', () => {
  let component: ThankyouDetailsComponent;
  let fixture: ComponentFixture<ThankyouDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankyouDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankyouDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
