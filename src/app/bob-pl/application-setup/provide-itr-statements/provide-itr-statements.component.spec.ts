import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvideItrStatementsComponent } from './provide-itr-statements.component';

describe('ProvideItrStatementsComponent', () => {
  let component: ProvideItrStatementsComponent;
  let fixture: ComponentFixture<ProvideItrStatementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvideItrStatementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvideItrStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
