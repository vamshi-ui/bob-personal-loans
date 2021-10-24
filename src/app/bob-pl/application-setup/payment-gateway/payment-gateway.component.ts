import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { GenericService } from 'src/app/shared/services/generic.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.scss']
})
export class PaymentGatewayComponent implements OnInit {
  saveCustomerScreenDetails: Object;
  token: any;
  applicationId: any;
  appPackId: any;
  paymentGatewayUrl: any;
  intervalId: any;
  gatewayLoader: boolean;
  myWindow: any;
  feeAmount: any;

  constructor(private service: ComponentInteractionService,
    private genericService: GenericService,
    private spinner: NgxSpinnerService,
    private router: Router) { }

  ngOnInit() {
    this.getToken();
    this.getAmount();
  }

  getAmount() {
    const payload = {
      applicationId: this.applicationId
    };
    this.spinner.show();
    this.genericService.gettingDisbursalData(payload, this.token).subscribe((result: any) => {
      this.spinner.hide();
      this.feeAmount = parseInt(result.processingFee) + parseInt(result.gst) + parseInt(result.stampduty);

    }, error => {
      this.spinner.hide();
    });

  }

  getToken(): void {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
    this.appPackId = localStorage.getItem('appPackId');
  }

  clickedPayment() {
    this.service.payment.next('Payment');

    const payload = {
      applicationId: this.applicationId,
      isNetOffFromDisbursalAmt: true,
      processingAmount: "1",
      customerName: "Rohan",
      customerEmail: "rohan@gmail.com",
      customerMobile: "9874563210",
      customerAddress: "hyderabad"
    }
    this.spinner.show();
    this.genericService.paymentGateway(payload, this.token).subscribe((resp: any) => {
      this.spinner.hide();
      if (resp.redirectUrl) {
        this.myWindow = window.open(resp.redirectUrl, '_blank');
        this.loginSetInterval();
      }
    }, err => {
      this.spinner.hide();
    });

  }

  // openWin() {
  //     myWindow = window.open("http://javatpoint.com", '_blank');
  //     myWindow.document.write("<p>This is 'myWindow'</p>");
  //   }

  //  closeWin() {
  //     myWindow.close();
  //   }

  loginSetInterval() {
    // this.gatewayLoader = true;

    this.intervalId = setInterval(() =>
      this.getGatewayStatus()
      , 3000);

    // setTimeout(() => {
    //     clearInterval(this.intervalId); 
    //     console.log("Oops..Session Timeout"); 
    //     this.gatewayLoader = false; 
    // }, 100000);
  }

  getGatewayStatus() {

    if (!this.myWindow) {
      // console.log("Unable to proceed Payment");
    } else if (this.myWindow.closed) {
      // console.log("closed")
      this.spinner.hide();
      clearInterval(this.intervalId);
      return;
    } else {
      // console.log("not closed")
    }

    let postdata = {
      applicationId: this.applicationId
    }
    this.spinner.show();
    this.genericService.getPatmentGatewayStatus(postdata, this.token).subscribe((resp: any) => {
      this.spinner.hide();
      const screenDetails = { "screenNumber": 26, "screenName": "Payment Gateway", "applicationId": this.applicationId, "product": "PL" }
      this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
      if (resp) {
        if (resp.action.toLowerCase() == 'success') {
          this.myWindow.close();
          const paymentDetails = {
            transactionId: resp.transactionId,
            transactionDate: resp.transactionDate,
            transactionAmout: resp.transactionAmout
          }
          this.service.processingFee.next(paymentDetails);
          // this.gatewayLoader = false;
          clearInterval(this.intervalId);
          this.router.navigate(["/application-setup/payment-gateway-result"]);
        } else if (resp.action == 'wait') {
          this.spinner.show();
          // this.gatewayLoader = false;
          // clearInterval(this.intervalId);
        } else {
          // this.gatewayLoader = false;
          clearInterval(this.intervalId);
        }
      }
    }, (error) => {
      // this.gatewayLoader = false;
      this.spinner.hide();
      this.gatewayLoader = false;
    });
  }

}
