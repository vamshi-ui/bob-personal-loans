import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ComponentInteractionService } from '../../../app/shared/material-modules/component-interaction.service';

@Component({
  selector: 'app-step-wizard',
  templateUrl: './step-wizard.component.html',
  styleUrls: ['./step-wizard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StepWizardComponent implements OnInit {
  public loan: any;
  public offerForYou: any;
  public thankYou: any;
  public payment;
  upload: boolean;
  customer: boolean;
  gst: boolean;
  basic: boolean;
  legal: boolean;
  image: boolean;
  e: boolean;
  setup: boolean;
  thankYouOne: boolean;
  disbursal: boolean;
  error: boolean;
  aip: boolean;

  constructor(private service: ComponentInteractionService) { }

  ngOnInit(): void {
    if (window.location.pathname == '/pl/user-input/customer-details'
    ) {
      this.loan = true;
    }
    else if (window.location.pathname == '/pl/user-input/business-details' ||
      window.location.pathname == '/pl/user-input/employment-details') {
      this.customer = true;
    }
    else {
      this.loan = false;
    }
    if (window.location.pathname == "/pl/offers-for-you"
    ) {
      this.offerForYou = true;
    }
    else {
      this.offerForYou = false;
    }
    if (window.location.pathname == "/pl/user-input/aip-loan-details"
    ) {
      this.aip = true;
    }
    else {
      this.aip = false;
    }
    if (window.location.pathname == "/pl/user-input/error"
    ) {
      this.error = true;
    }
    else {
      this.error = false;
    }
    if (window.location.pathname == "/pl/application-setup/provide-bank-statements" ||
      window.location.pathname == "/pl/application-setup/upload-itr-statements" ||
      window.location.pathname == "/pl/application-setup/provide-itr-statements" ||
      window.location.pathname == "/pl/application-setup/upload-bank-statements" ||
      window.location.pathname == "/pl/application-setup/utility-bill" ||
      window.location.pathname == "/pl/application-setup/approved-loans" ||
      window.location.pathname == "/pl/application-setup/video-kyc" ||
      window.location.pathname == "/pl/application-setup/primary-account"
    ) {
      this.upload = true;
    }
    else {
      this.upload = false;
    }
    if (window.location.pathname == "/pl/application-setup/verify-gst") {
      this.gst = true;
    }
    else {
      this.gst = false;
    }
    if (window.location.pathname == "/pl/application-setup/basic-tnc" ||
      window.location.pathname == "/pl/application-setup/e-contract" ||
      window.location.pathname == "/pl/application-setup/auto-debit"
    ) {
      this.basic = true;
    }
    else {
      this.basic = false;
    }
    if (window.location.pathname == "/pl/application-setup/disbursal") {
      this.disbursal = true;
    }
    else {
      this.disbursal = false;
    }
    if (window.location.pathname == "/pl/application-setup/legal-heir"
    ) {
      this.legal = true;
    }
    else {
      this.legal = false;
    }
    if (window.location.pathname == "/pl/application-setup/image-kyc") {
      this.image = true;
    }
    else {
      this.image = false;
    }
    if (window.location.pathname == "/pl/application-setup/auto-debit-setup") {
      this.setup = true;
    }
    else {
      this.setup = false;
    }
    if (window.location.pathname == "/pl/application-setup/e-kyc") {
      this.e = true;
    }
    else {
      this.e = false;
    } if (window.location.pathname == "/pl/money-in-account") {
      this.thankYouOne = true;
    }
    else {
      this.thankYou = false;
    }
  }

}
