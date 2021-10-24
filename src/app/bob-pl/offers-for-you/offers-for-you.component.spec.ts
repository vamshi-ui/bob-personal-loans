import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersForYouComponent } from './offers-for-you.component';

describe('OffersForYouComponent', () => {
  let component: OffersForYouComponent;
  let fixture: ComponentFixture<OffersForYouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersForYouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersForYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
