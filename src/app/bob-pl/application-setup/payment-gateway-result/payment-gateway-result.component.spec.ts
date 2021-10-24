import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentGatewayResultComponent } from './payment-gateway-result.component';

describe('PaymentGatewayResultComponent', () => {
  let component: PaymentGatewayResultComponent;
  let fixture: ComponentFixture<PaymentGatewayResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentGatewayResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentGatewayResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
