import { Component, OnInit } from '@angular/core';
import { VideoKycDialogComponent } from './video-kyc-dialog/video-kyc-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GenericService } from '../../../shared/services/generic.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-video-kyc',
  templateUrl: './video-kyc.component.html',
  styleUrls: ['./video-kyc.component.scss'],
})
export class VideoKycComponent implements OnInit {
  saveCustomerScreenDetails: Object;
  token: string;
  appId: string;
  accountHolder: string;
  approvalLoan: string;
  constructor(public dialog: MatDialog,
    public route: Router,
    private genericService: GenericService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getToken();
  }

  getToken(): void {
    this.appId = localStorage.getItem('applicationId');
    this.token = localStorage.getItem('token');
    this.approvalLoan = localStorage.getItem('approvalLoan');
    this.accountHolder = localStorage.getItem('accountHolder');
  }


  now(): void {
    const screenDetails = { "screenNumber": 22, "screenName": "VIdeo KYC", "applicationId": this.appId, "product": "PL" }
    this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
    const data = {
      "urn": this.appId,
      "productCode": "PL"
    }
    this.spinner.show();
    this.genericService.videoKyc(data, this.token).subscribe((result) => {
      this.spinner.hide();
      this.route.navigate(['/application-setup/e-contract']);
    }, error => {
      this.spinner.hide();
    });
  }

  openVkyc(): void {
    const screenDetails = { "screenNumber": 22, "screenName": "VIdeo KYC", "applicationId": this.appId, "product": "PL" }
    this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
    // const dialogRef = this.dialog.open(VideoKycDialogComponent, {
    //   // height: '400px',
    //   width: '750px',
    //   disableClose: true,
    // });
    this.route.navigate(['/application-setup/e-contract']);


    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
}
