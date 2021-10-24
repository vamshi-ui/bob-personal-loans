import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { GenericService } from '../../../shared/services/generic.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-disbursal-details',
  templateUrl: './disbursal-details.component.html',
  styleUrls: ['./disbursal-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class DisbursalDetailsComponent implements OnInit {

  saveCustomerScreenDetails: Object;
  totalEmi: any;
  disbursalDetail = true;
  gettingDisbursalInfirmantion: any
  applicationId: any;
  token: any
  loanTenure: any;
  rateOfInterest: any;

  constructor(public dialog: MatDialog,
    private route: Router,
    private service: ComponentInteractionService,
    private genericService: GenericService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.gettingToken();
    this.gettingDisbursalData();
  }

  gettingToken() {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
  }

  gettingDisbursalData() {
    const payload = {
      applicationId: this.applicationId
    };
    this.spinner.show();
    this.genericService.getLoanRequirements(payload, this.token).subscribe((result) => {
      this.spinner.hide();
      this.gettingDisbursalInfirmantion = result;

      // if(this.gettingDisbursalInfirmantion.output === "REJECT" || this.gettingDisbursalInfirmantion.output === null){
      //   this.route.navigate(['/offer-reject']);
      // }

      if (this.gettingDisbursalInfirmantion.output === "APPROVE" || this.gettingDisbursalInfirmantion.output === null) {

      } else {
        this.route.navigate(['/offer-reject']);
        return;
      }

      this.gettingDisbursalInfirmantion.approvalLoan = this.gettingDisbursalInfirmantion.approvalLoan === 0 ? "0" : this.gettingDisbursalInfirmantion.approvalLoan;
      this.loanTenure = this.gettingDisbursalInfirmantion.tenure === 0 ? "0" : this.gettingDisbursalInfirmantion.tenure;
      this.rateOfInterest = this.gettingDisbursalInfirmantion.roi === 0 ? "0" : this.gettingDisbursalInfirmantion.roi;
      this.totalEmi = this.gettingDisbursalInfirmantion.emi ? this.gettingDisbursalInfirmantion.emi : "0";
      this.gettingDisbursalInfirmantion.processingFee = this.gettingDisbursalInfirmantion.processingFee === 0 ? "0" : this.gettingDisbursalInfirmantion.processingFee;
      this.gettingDisbursalInfirmantion.gst = this.gettingDisbursalInfirmantion.gst === 0 ? "0" : this.gettingDisbursalInfirmantion.gst;
      this.gettingDisbursalInfirmantion.stampduty = this.gettingDisbursalInfirmantion.stampduty === 0 ? "0" : this.gettingDisbursalInfirmantion.stampduty;
      this.gettingDisbursalInfirmantion.netLoanAmount = this.gettingDisbursalInfirmantion.netLoanAmount === 0 ? "0" : this.gettingDisbursalInfirmantion.netLoanAmount;
      // this.emiCalculation();
    }, error => {
      this.spinner.hide();
    });
  }

  emiCalculation() {
    const rightHandLogic: any = [1 - Math.pow((1 + this.gettingDisbursalInfirmantion.roi / 1200), (-(this.gettingDisbursalInfirmantion.tenure)))]
    this.totalEmi = (this.gettingDisbursalInfirmantion.loanAmount * this.gettingDisbursalInfirmantion.roi / 1200) / rightHandLogic;
    this.totalEmi = this.totalEmi === 0 ? "0" : this.totalEmi;
  }

  // disbursalDetails() {
  //   this.disbursalDetail = this.disbursalDetail === true ? false : true;
  // }

  openDialog() {
    const screenDetails = { "screenNumber": 23, "screenName": "DIsbursal details", "applicationId": this.applicationId, "product": "PL" }
    this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
    const payload = {
      applicationId: this.applicationId,
      // netLoanAmount: this.gettingDisbursalInfirmantion.netLoanAmount,
      // netOff: this.disbursalDetail
    };
    this.spinner.show();
    this.genericService.saveDisbursalData(payload, this.token).subscribe((result) => {
      this.spinner.hide();
      // if (this.disbursalDetail) {
      this.dialog.open(ConfirmationDialogComponent, {
        disableClose: true,
      });
      this.service.moneyInAccount.next(30);
      this.service.moneyInAccount1.next(24);
      // } 
      // else {
      // this.route.navigate(['/application-setup/payment-gateway']);
      // }
    }, error => {
      this.spinner.hide();
    });
  }
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: 'confirmation-dialog.html',
})
export class ConfirmationDialogComponent implements OnInit {

  gettingDisbursalNumbers: any;
  applicationId: any;
  token: any;
  constructor(private genericService: GenericService,
    private route: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.gettingToken();
    this.gettingDisbursalNumber();
  }

  gettingToken() {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
  }

  gettingDisbursalNumber() {
    const payload = {
      applicationId: this.applicationId,
      templateName: "disbursementamount",
      communicationType: "EMAIL"
    };
    this.spinner.show();
    this.genericService.gettingDisbursalNumber(payload, this.token).subscribe((result) => {
      this.spinner.hide();
      this.gettingDisbursalNumbers = result;
    }, error => {
      this.spinner.hide();
    });
  }

  confirmDisbursalNumber() {
    const payload = {
      applicationId: this.applicationId,
      disbursalNumber: 12343435,
      status: "Success",
    };
    this.spinner.show();
    this.genericService.confirmDisbursalStatus(payload, this.token).subscribe((result) => {
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
    this.route.navigate(['/money-in-account']);
  }

}

