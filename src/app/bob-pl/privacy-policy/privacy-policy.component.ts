import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../shared/services/generic.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  saveCustomerScreenDetails: Object;
  applicationId: string;
  token: string;
  constructor(
    private genericService: GenericService,
  ) { }

  ngOnInit() {
    this.getToken();
    const screenDetails = { "screenNumber": 30, "screenName": "Privacy Policy", "applicationId": this.applicationId, "product": "PL" }
    this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
  }
  getToken(): void {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
  }
}
