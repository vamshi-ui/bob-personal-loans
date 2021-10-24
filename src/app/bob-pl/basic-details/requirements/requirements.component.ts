import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../../shared/services/generic.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent implements OnInit {
  response: any;
  token: string;
  data: object;
  salaried: boolean = true;
  selfEmplied: boolean = false;

  constructor(private genericService: GenericService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getToken();
  }

  forSalaried() {
    this.salaried = true;
    this.selfEmplied = false;

  }

  forSelfEmplied() {
    this.salaried = false;
    this.selfEmplied = true;

  }

  getToken() {
    this.spinner.show();
    this.genericService.getToken().subscribe((result) => {
      this.spinner.hide();
      this.response = result;
      const stringToken = JSON.stringify(this.response.token);
      this.token = stringToken.substring(1, stringToken.length - 1);
      localStorage.setItem('token', this.token);
      this.getRequirementData();
    }, error => {
    });
  }

  getRequirementData() {
    this.genericService.getRequirements(this.token).subscribe(result => {
      this.data = result;
    }, error => {
    });
  }

}
