import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EContractTncComponent } from './e-contract-tnc.component';

describe('EContractTncComponent', () => {
  let component: EContractTncComponent;
  let fixture: ComponentFixture<EContractTncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EContractTncComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EContractTncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
