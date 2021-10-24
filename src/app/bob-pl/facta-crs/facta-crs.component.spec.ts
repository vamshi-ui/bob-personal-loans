import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactaCrsComponent } from './facta-crs.component';

describe('FactaCrsComponent', () => {
  let component: FactaCrsComponent;
  let fixture: ComponentFixture<FactaCrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactaCrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactaCrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
