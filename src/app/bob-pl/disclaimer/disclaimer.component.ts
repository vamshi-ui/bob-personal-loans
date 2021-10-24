import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../shared/services/generic.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent implements OnInit {

  saveCustomerScreenDetails: Object;
  applicationId: string;
  token: string;
  constructor(
    private genericService: GenericService,
  ) { }

  ngOnInit() {
    this.getToken();
    const screenDetails = { "screenNumber": 29, "screenName": "DIsclaimer", "applicationId": this.applicationId, "product": "PL" }
    this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
  }
  getToken(): void {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
  }

}

