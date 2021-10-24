import { Component, OnInit } from '@angular/core';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { GenericService } from '../../../shared/services/generic.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-thankyou-details',
  templateUrl: './thankyou-details.component.html',
  styleUrls: ['./thankyou-details.component.scss']
})
export class ThankyouDetailsComponent implements OnInit {
  saveCustomerScreenDetails: any;
  token: any;
  applicationId: any;
  gettingThankyou: any;
  tmsData: any;
  customerDetails: any;
  templateName: any;


  constructor(private service: ComponentInteractionService,
    private genericService: GenericService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.gettingToken();
    this.gettingThankYou();
    this.saveScreenDetails();
  }

  gettingToken() {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
  }

  saveScreenDetails() {
    // const payload = {
    //   applicationId: this.applicationId
    // };
    // this.spinner.show();
    // this.genericService.gettingThankyouData(payload, this.token).subscribe((result) => {
    //   this.spinner.hide();
    //   this.gettingThankyou = result;
    // }, error => {
    //   this.spinner.hide();
    // });

    const screenDetails = { "screenNumber": 31, "screenName": "Thank you", "applicationId": this.applicationId, "product": "PL" }
    this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })

  }

  gettingThankYou() {
    const customerDetails = {
      applicationId: this.applicationId
    };

    this.genericService.getCustomerStatus(customerDetails, this.token).subscribe(resp => {
      if (resp) {
        this.customerDetails = resp;
        if (this.customerDetails.accountHolder === "No") {
          this.templateName = 'thankyoupage(ntb)pl'
        } else {
          this.templateName = 'thankyoupage(etb)pl'
        }
        this.getTMS(this.templateName);
      }
    });
  }

  getTMS(templateName) {
    const data = {
      communicationType: "EMAIL",
      applicationId: this.applicationId,
      templateName: templateName,
    }
    this.genericService.termsAndConditions(data, this.token).subscribe((res) => {
      this.tmsData = res;
    }, err => {
    });
  }

}
