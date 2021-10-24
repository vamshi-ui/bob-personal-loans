import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetOffDialogComponent } from './net-off-dialog.component';

describe('NetOffDialogComponent', () => {
  let component: NetOffDialogComponent;
  let fixture: ComponentFixture<NetOffDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetOffDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetOffDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
