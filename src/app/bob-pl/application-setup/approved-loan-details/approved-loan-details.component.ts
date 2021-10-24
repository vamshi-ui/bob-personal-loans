import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GenericService } from '../../../shared/services/generic.service';
import { log } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';

@Component({
  selector: 'app-approved-loan-details',
  templateUrl: './approved-loan-details.component.html',
  styleUrls: ['./approved-loan-details.component.scss']
})
export class ApprovedLoanDetailsComponent implements OnInit {
  saveCustomerScreenDetails: Object;
  token: any;
  applicationId: any;
  loanDetails: any;
  monthlyEmi: any;
  applicantName: any;
  loanAmount: any;
  tenure: any;
  interestRate: any;
  emi: any;
  processingFee: any;
  gst: any;
  stampduty: any;

  constructor(private genericService: GenericService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private service:ComponentInteractionService) { }

  ngOnInit() {
    this.getToken();
    this.gettingApprovedLoanDetails();
  }

  getToken() {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
  }

  // goBack() {
  //   this.route.navigate(['/application-setup/utility-bill']);
  // }

  gettingApprovedLoanDetails() {
    const payload = {
      applicationId: this.applicationId
    };
    this.spinner.show();
    this.genericService.approvedLoanDetails(payload, this.token).subscribe((result) => {

      const screenDetails = { "screenNumber": 15, "screenName": "Approved loans", "applicationId": this.applicationId, "product": "PL" }
      this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x });

      this.spinner.hide();
      this.loanDetails = result;
      // this.emiCalculation();

      this.service.rejectTemplate.next(this.loanDetails.output);

      if(this.loanDetails.output === "REJECT" || this.loanDetails.output === null){
        this.route.navigate(['/offer-reject']);
      } else if (this.loanDetails.output === "REFER") {
        this.route.navigate(['/offer-reject']);
        return;
      }

      this.applicantName = this.loanDetails.applicantName ? this.loanDetails.applicantName : "";
      this.loanAmount = this.loanDetails.loanAmount === 0 ? "0" : this.loanDetails.loanAmount;
      this.tenure = this.loanDetails.tenure === 0 ? "0" : this.loanDetails.tenure;
      this.interestRate = this.loanDetails.interestRate === 0 ? "0" : this.loanDetails.interestRate;
      this.emi = this.loanDetails.emi === 0 ? "0" : this.loanDetails.emi;
      this.processingFee = this.loanDetails.processingFee === 0 ? "0" : this.loanDetails.processingFee;
      this.gst = this.loanDetails.gst === 0 ? "0" : this.loanDetails.gst;
      this.stampduty = this.loanDetails.stampduty === 0 ? "0" : this.loanDetails.stampduty;

    }, error => {
      this.spinner.hide();
    });
  }

  emiCalculation() {
    const rightHandLogic: any = [1 - Math.pow((1 + this.loanDetails.interestRate / 1200), (-(this.loanDetails.tenure)))]
    this.monthlyEmi = (this.loanDetails.approvalLoan * this.loanDetails.interestRate / 1200) / rightHandLogic;
  }

}
