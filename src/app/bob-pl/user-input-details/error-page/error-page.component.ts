import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../../shared/services/generic.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
  saveCustomerScreenDetails: any;
  token: string;
  appId: string;
  errorPageDetails: Object;

  constructor(public service: GenericService) { }

  ngOnInit() {
    this.serviceGenerate()
  }

  serviceGenerate() {
    this.token = localStorage.getItem('token');
    this.appId = localStorage.getItem('applicationId');
    this.errorMessage();
  }

  errorMessage() {
    const data = {
      applicationId: this.appId,
      templateName: 'aadharmismatch',
      communicationType: 'SMS'
    }

    this.service.getErrorPageDetails(data, this.token).subscribe((x) => {
      this.errorPageDetails = x
      const screenDetails = { "screenNumber": 9, "screenName": "Error", "applicationId": this.appId, "product": "PL" }
      this.service.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
    })
  }
}
