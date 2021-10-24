import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthDeclarationDetailsComponent } from './health-declaration-details.component';

describe('HealthDeclarationDetailsComponent', () => {
  let component: HealthDeclarationDetailsComponent;
  let fixture: ComponentFixture<HealthDeclarationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthDeclarationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthDeclarationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
