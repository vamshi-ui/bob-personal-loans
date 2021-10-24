import { Component, OnInit, Inject } from '@angular/core';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GenericService } from '../../shared/services/generic.service';
import { ComponentInteractionService } from '../../shared/material-modules/component-interaction.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-resend-otp-dialog',
  templateUrl: './resend-otp-dialog.component.html',
  styleUrls: ['./resend-otp-dialog.component.scss']
})
export class ResendOtpDialogComponent implements OnInit {

  popUpData: Object;
  applicationId: string;
  token: string;
  screenData: any;
  gettingData: any;
  constructor(
    private dilogRef: MatDialogRef<ResendOtpDialogComponent>,
    private route: Router,
    private service: ComponentInteractionService,
    private spinner: NgxSpinnerService,
    private genericService: GenericService
  ) {

  }

  ngOnInit() {
    this.getToken();
    this.gettingDropOffData();
  }
  getToken() {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
  }
  gettingDropOffData() {
    this.gettingData =
      this.service.popupShow.subscribe(data => {
        this.screenData = data
        this.getDataFromTMC();
      }, err => {

      })
  }
  getDataFromTMC() {
    const data = {
      communicationType: "SMS",
      applicationId: this.applicationId,
      templateName: this.screenData.dropoffTempName,
    }
    this.spinner.show();
    this.genericService.termsAndConditions(data, this.token).subscribe((res) => {
      this.popUpData = res;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }

  redirectHome() {
    this.dilogRef.close();
    this.route.navigate(['']);
  }

}
