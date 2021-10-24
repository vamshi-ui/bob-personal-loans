import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericService } from '../../../shared/services/generic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-primary-account',
  templateUrl: './primary-account.component.html',
  styleUrls: ['./primary-account.component.scss']
})
export class PrimaryAccountComponent implements OnInit {
  saveCustomerScreenDetails: Object;
  appId: string;
  token: string;
  loanProductType: any;
  getPrimaryDetails: any = 'Null';
  savePrimaryDetails: Object;
  accountNumber: any = '';
  checked: boolean = false ;
  data: { applicationId: string; accountNumber: any; };

  constructor(public route: Router,
    public service: ComponentInteractionService,
    public spinner: NgxSpinnerService,
    private genericService: GenericService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getToken();
  }
  getToken(): void {
    this.token = localStorage.getItem('token');
    this.appId = localStorage.getItem('applicationId');
    this.serviceGenerate();
  }

  serviceGenerate() {
    const data = { "applicationId": this.appId }
    this.genericService.getPrimaryAccountDetails(data, this.token).subscribe(x => {
    this.getPrimaryDetails = x;
      if (this.getPrimaryDetails.accDtls.length == 1) {
        this.checked = true;
      }

      if (this.getPrimaryDetails.accDtls.length > 1) {
        for (let i = 0; i < this.getPrimaryDetails.accDtls.length; i++) {
          if (this.getPrimaryDetails.accDtls[i].primary == true) {
            this.accountNumber = this.getPrimaryDetails.accDtls[i].accountNumber;
          }
        }
      }

      // if(this.getPrimaryDetails.accDtls.length == 0)
      // {
      //   this.route.navigate(['/application-setup/provide-bank-statements']);
      // }

    }, error => {
    });
  }

  saveAccountdetails(data, index, value) {

    this.accountNumber = value

  }

  onSubmit() {


    if (this.getPrimaryDetails.accDtls.length == 0) {
      this.route.navigate(['/application-setup/provide-bank-statements']);
    }
    if (this.getPrimaryDetails.accDtls.length >= 1) {
      if (this.getPrimaryDetails.accDtls.length == 1) {
        this.data =
          {
            "applicationId": this.appId,
            "accountNumber": this.getPrimaryDetails.accDtls[0].accountNumber
          }
      }
      else if (this.getPrimaryDetails.accDtls.length > 1) {
        if (this.accountNumber != "") {
          this.data =
            {
              "applicationId": this.appId,
              "accountNumber": this.accountNumber
            }
        }
        else {
          this.toaster.error("Please select your Primary Account");
          return;
        }
      }
      if (this.accountNumber != "" || this.getPrimaryDetails.accDtls.length == 1) {
        this.spinner.show();
        this.genericService.savePrimaryAccountDetails(this.data, this.token).subscribe(x => {
        this.savePrimaryDetails = x;
          this.spinner.hide();
          this.route.navigate(['/application-setup/provide-bank-statements']);
        }, err => {
          this.spinner.hide();
        })
      }
    }
    // const screenDetails = { "screenNumber": 24, "screenName": "primary account", "applicationId": this.appId, "product": "ML" }
    // this.genericService.saveCustomerData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })


  }

}

