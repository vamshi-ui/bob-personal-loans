import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingDetailsComponent } from './processing-details.component';

describe('ProcessingDetailsComponent', () => {
  let component: ProcessingDetailsComponent;
  let fixture: ComponentFixture<ProcessingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
