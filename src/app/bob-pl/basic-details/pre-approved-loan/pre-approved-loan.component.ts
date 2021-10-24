import { Component, OnInit } from '@angular/core';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { GenericService } from '../../../shared/services/generic.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pre-approved-loan',
  templateUrl: './pre-approved-loan.component.html',
  styleUrls: ['./pre-approved-loan.component.scss']
})
export class PreApprovedLoanComponent implements OnInit {

  saveCustomerScreenDetails: Object;
  loginDetails: any;
  token: any;
  appId: any;
  appPackId: any;
  offerAccpted: any;
  // requiredAmount: any;
  preapprovedamt: any;
  customerDetails: any;

  constructor(private service: ComponentInteractionService,
    private genericService: GenericService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.loginId();
    this.getToken();
  }

  getToken(): void {
    this.token = localStorage.getItem('token');
    this.appId = localStorage.getItem('applicationId');
    this.appPackId = localStorage.getItem('appPackId');
    // this.preapprovedamt = localStorage.getItem('preapprovedamt');
    // localStorage.removeItem('requiredHigherAmount');
    this.getCustomerData();
  }

  getCustomerData() {
    const customerDetails = {
      applicationId: this.appId
    };
    this.spinner.show();
    this.genericService.getCustomerStatus(customerDetails, this.token).subscribe(result => {
      this.spinner.hide();

      this.customerDetails = result;
      this.preapprovedamt = this.customerDetails.preapprovedamt;
    }, error => {
      this.spinner.hide();
    });
  }

  clickedPreApproved() {
    this.service.loan.next('5');

    const screenDetails = { "screenNumber": 4, "screenName": "Pre approved amount details", "applicationId": this.appId, "product": "PL" }
    this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })

    this.router.navigate(['user-input/aip-loan-details']);

    // const screenPaylaod = {
    //   applicationId: this.appId
    // }
    // this.spinner.show();
    // this.genericService.customerDecision(screenPaylaod, this.token).subscribe((result) => {

    //   const screenDetails = { "screenNumber": 4, "screenName": "Pre approved amount details", "applicationId": this.appId, "product": "PL" }
    //   this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })

    //   this.spinner.hide();
    //   this.requiredAmount = result;
    //   this.router.navigate(['user-input/aip-loan-details']);
    // }, err => {
    //   this.spinner.hide();
    //   this.router.navigate(['user-input/aip-loan-details']);
    // });

  }

  requiredHigherAmount() {

    const screenDetails = { "screenNumber": 4, "screenName": "Pre approved amount details", "applicationId": this.appId, "product": "PL" }
    this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })

    this.router.navigate(['/user-input/loan-details']);

    // const paylaod = {
    //   applicationId: this.appId
    // }
    // this.spinner.show();
    // localStorage.setItem("requiredHigherAmount", 'true');
    // this.genericService.customerDecision(paylaod, this.token).subscribe((result) => {

    //   const screenDetails = { "screenNumber": 4, "screenName": "Pre approved amount details", "applicationId": this.appId, "product": "PL" }
    //   this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })

    //   this.spinner.hide();
    //   this.requiredAmount = result;
    //   this.router.navigate(['/user-input/loan-details']);
    // }, err => {
    //   this.spinner.hide();
    //   this.router.navigate(['/user-input/loan-details']);
    // });

  }

  loginId() {
    this.service.loginDetailsShare.subscribe((x: any) => {
      this.loginDetails = x;
    });
  }
}
