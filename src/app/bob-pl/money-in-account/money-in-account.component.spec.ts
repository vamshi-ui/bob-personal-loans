import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyInAccountComponent } from './money-in-account.component';

describe('MoneyInAccountComponent', () => {
  let component: MoneyInAccountComponent;
  let fixture: ComponentFixture<MoneyInAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoneyInAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyInAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
