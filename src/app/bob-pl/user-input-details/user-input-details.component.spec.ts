import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInputDetailsComponent } from './user-input-details.component';

describe('UserInputDetailsComponent', () => {
  let component: UserInputDetailsComponent;
  let fixture: ComponentFixture<UserInputDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInputDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInputDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
