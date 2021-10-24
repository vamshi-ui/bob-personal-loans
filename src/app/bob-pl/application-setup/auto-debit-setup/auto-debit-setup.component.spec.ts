import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoDebitSetupComponent } from './auto-debit-setup.component';

describe('AutoDebitSetupComponent', () => {
  let component: AutoDebitSetupComponent;
  let fixture: ComponentFixture<AutoDebitSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoDebitSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoDebitSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
