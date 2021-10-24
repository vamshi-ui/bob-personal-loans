import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IndianCurrencyPipe } from 'src/app/shared/material-modules/pipes/indian-currency.pipe';
import { GenericService } from 'src/app/shared/services/generic.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidatorService } from 'src/app/shared/validations/validator.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoanDetailsComponent implements OnInit {
  saveCustomerScreenDetails: Object;
  rangeValue: any = 50000;
  max = 1000000;
  min = 50000;
  grossIncome: boolean;
  gross: boolean;
  minRangeValue: any = 12;
  minMonths: any = 12;
  maxMonths: any = 60;
  interestRate: any = 11;
  monthlyEmi: any = 18644;
  insurancePremium: any = 1000;
  token: any;
  loanRequirements: any;
  saveLoanRequirementData: any;
  loanDetailsForm: FormGroup;
  applicationId: any;
  name: any;
  customerDetails: any;

  constructor(private genericService: GenericService,
    private fb: FormBuilder,
    private validator: ValidatorService,
    private spinner: NgxSpinnerService,
    private route: Router) { }

  ngOnInit() {
    this.loanDetails();
    this.getToken();
    this.getLoanRequirements();
  }


  loanDetails() {
    this.loanDetailsForm = this.fb.group({
      loanAmount: ['50000', [Validators.required, Validators.pattern(`^[1-9][0-9,]*$`)]],
      loanTenure: '',
    });
  }

  getToken() {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
    this.getCustomerData();
  }

  getCustomerData() {
    const customerDetails = {
      applicationId: this.applicationId
    };
    this.spinner.show();
    this.genericService.getCustomerStatus(customerDetails, this.token).subscribe(result => {
      this.spinner.hide();
      this.customerDetails = result;
    }, error => {
      this.spinner.hide();
    });
  }

  getLoanRequirements() {
    if (this.applicationId === null) {

    } else {
      this.spinner.show();
      const payload = {
        applicationId: this.applicationId
      };
      this.genericService.getLoanRequirements(payload, this.token).subscribe(result => {
        this.loanRequirements = result;
        this.spinner.hide();

        if (this.customerDetails.preapprovedamt > 0) {
          this.rangeValue = this.customerDetails.preapprovedamt ? this.customerDetails.preapprovedamt : this.rangeValue;
          this.min = this.customerDetails.preapprovedamt ? this.customerDetails.preapprovedamt : this.min;
        } else {
          this.rangeValue = this.loanRequirements.loanAmount ? this.loanRequirements.loanAmount : this.rangeValue;
        }
        this.minRangeValue = this.loanRequirements.tenure ? this.loanRequirements.tenure : this.minRangeValue;
        this.name = this.loanRequirements.applicantName ? this.loanRequirements.applicantName : '';
      }, error => {
        this.spinner.hide();
      });
    }
  }

  formatLabel(value: number): any {
    return value + ' ' + 'months';
  }

  formatThumbLabel(value: number): any {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    });
    return formatter.format(value);
  }

  Change(data): void {

    this.rangeValue = data.replace(',', '').replace(',', '').replace(',', '');
    if (data === '') {
      this.gross = true;
    } else if (this.rangeValue < 50000 || this.rangeValue > 1000000) {
      this.grossIncome = true;
      this.gross = false;
    } else {
      this.gross = false;
      this.grossIncome = false;
    }
  }

  MonthChange(data): void {
    this.minRangeValue = data;
  }

  sliderValue(data) {
    this.rangeValue = data;
    if (data === '') {
      this.gross = true;
    } else if (data < 50000 || data > 1000000) {
      this.grossIncome = true;
      this.gross = false;
    } else {
      this.gross = false;
      this.grossIncome = false;
      this.loanDetailsForm.get('loanAmount').patchValue(data);
    }
    if (!this.loanDetailsForm.get('loanAmount').valid) {
      this.loanDetailsForm.get('loanAmount').reset();
    }
  }

  monthsliderValue(data): void {
    this.minRangeValue = data;
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // goBack() {
  //   this.route.navigate(['/borrower-details']);
  // }

  submit() {
    if (this.applicationId === null) {
      this.route.navigate(['/user-input/customer-details']);
    } else if (this.loanDetailsForm.valid && !this.gross && !this.grossIncome) {
      const payload = {
        loanAmount: this.rangeValue,
        applicationId: this.applicationId,
        tenure: this.minRangeValue,
      };
      this.genericService.saveLoanRequirements(payload, this.token).subscribe(result => {
        this.saveLoanRequirementData = result;
        const screenDetails = { "screenNumber": 8, "screenName": "Loan requirements", "applicationId": this.applicationId, "product": "PL" }
        this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
        this.spinner.hide();

        // if (this.customerDetails.appliedLoanAmount > this.customerDetails.preapprovedamt) {
        //   this.route.navigate(['/application-setup/provide-bank-statements']);
        // } else {
        this.route.navigate(['/user-input/customer-details']);
        // }
      }, error => {
        this.spinner.hide();
      });
    }
  }
}
