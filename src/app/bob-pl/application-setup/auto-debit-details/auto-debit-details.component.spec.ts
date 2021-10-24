import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoDebitDetailsComponent } from './auto-debit-details.component';

describe('AutoDebitDetailsComponent', () => {
  let component: AutoDebitDetailsComponent;
  let fixture: ComponentFixture<AutoDebitDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoDebitDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoDebitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
