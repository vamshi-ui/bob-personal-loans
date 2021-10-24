import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiMandateComponent } from './si-mandate.component';

describe('SiMandateComponent', () => {
  let component: SiMandateComponent;
  let fixture: ComponentFixture<SiMandateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiMandateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiMandateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
