import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageKycComponent } from './image-kyc.component';

describe('ImageKycComponent', () => {
  let component: ImageKycComponent;
  let fixture: ComponentFixture<ImageKycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageKycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
