import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';

@Component({
  selector: 'app-payment-gateway-result',
  templateUrl: './payment-gateway-result.component.html',
  styleUrls: ['./payment-gateway-result.component.scss']
})
export class PaymentGatewayResultComponent implements OnInit {

  paymentDetails: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private service: ComponentInteractionService) { }

  ngOnInit() {

    // this.route.params.subscribe(params => {
    //   this.paymentDetails = params;
    // });
    this.service.processingFeeShare.subscribe((res: any) => {
          this.paymentDetails = res;
    });

  }

  proceed() {
    this.router.navigate(['/money-in-account']);
  }

}
