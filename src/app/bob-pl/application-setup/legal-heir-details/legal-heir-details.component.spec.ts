import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalHeirDetailsComponent } from './legal-heir-details.component';

describe('LegalHeirDetailsComponent', () => {
  let component: LegalHeirDetailsComponent;
  let fixture: ComponentFixture<LegalHeirDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalHeirDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalHeirDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
