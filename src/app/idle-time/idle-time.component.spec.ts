import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdleTimeComponent } from './idle-time.component';

describe('IdleTimeComponent', () => {
  let component: IdleTimeComponent;
  let fixture: ComponentFixture<IdleTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdleTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdleTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
