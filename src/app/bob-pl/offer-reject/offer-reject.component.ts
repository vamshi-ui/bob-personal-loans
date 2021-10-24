import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/shared/services/generic.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-reject',
  templateUrl: './offer-reject.component.html',
  styleUrls: ['./offer-reject.component.scss']
})
export class OfferRejectComponent implements OnInit {
  token: any;
  applicationId: any;
  tmsData: any;
  templateName: any;
  saveCustomerScreenDetails: Object;
  customerData: any;

  constructor(private genericService: GenericService,
    private spinner: NgxSpinnerService,
    private service: ComponentInteractionService,
    public router: Router) { }

  ngOnInit() {
    this.getToken();
  }

  getToken() {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
    // this.service.rejectTemplateShare.subscribe(x => this.getTMS(x));
    this.getCustomerDetails();
  }

  getCustomerDetails() {
    const customerDetails = {
      applicationId: this.applicationId
    };
    this.genericService.getCustomerStatus(customerDetails, this.token).subscribe(resp => {
      this.customerData = resp;
      if (this.customerData.boundaryCheck === "REJECT" || this.customerData.eligibility === "REJECT") {
        this.getTMS("REJECT");
      } else if(this.customerData.boundaryCheck === "REFER" || this.customerData.eligibility === "REFER") {
        this.getTMS("REFER");
      } else {
        this.getTMS("REJECT");
      }
    });
  }

  getTMS(rejectType) {
    if (rejectType === "REJECT" || rejectType === null) {
      this.templateName = 'breoutcome:rejected';
    } else if (rejectType === "REFER") {
      this.templateName = 'breoutcome:creditrefer';
    }

    const data = {
      communicationType: "SMS",
      applicationId: this.applicationId,
      templateName: this.templateName,
    }
    this.spinner.show();
    this.genericService.termsAndConditions(data, this.token).subscribe((res) => {
      this.tmsData = res;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }

  home() {
    const screenDetails = { "screenNumber": 32, "screenName": "Offer Reject", "applicationId": this.applicationId, "product": "PL" }
    this.spinner.show();
    this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => {
      this.saveCustomerScreenDetails = x;
      this.spinner.hide();
    },
      error => { this.spinner.hide(); })

    this.router.navigate(['/'])
  }


}
