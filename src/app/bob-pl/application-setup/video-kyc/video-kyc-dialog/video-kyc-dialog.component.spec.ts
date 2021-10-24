import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoKycDialogComponent } from './video-kyc-dialog.component';

describe('VideoKycDialogComponent', () => {
  let component: VideoKycDialogComponent;
  let fixture: ComponentFixture<VideoKycDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoKycDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoKycDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
