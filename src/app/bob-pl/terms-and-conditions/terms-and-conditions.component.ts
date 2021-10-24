import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../shared/services/generic.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  saveCustomerScreenDetails: Object;
  applicationId: string;
  token: string;
  constructor(
    private genericService: GenericService,
  ) { }

  ngOnInit() {
    this.getToken();
    const screenDetails = { "screenNumber": 28, "screenName": "Terms and conditions", "applicationId": this.applicationId, "product": "PL" }
    this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
  }
  getToken(): void {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
  }


}
