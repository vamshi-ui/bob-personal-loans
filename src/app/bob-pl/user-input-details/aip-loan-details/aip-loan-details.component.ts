import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { ValidatorService } from 'src/app/shared/validations/validator.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericService } from 'src/app/shared/services/generic.service';

@Component({
  selector: 'app-aip-loan-details',
  templateUrl: './aip-loan-details.component.html',
  styleUrls: ['./aip-loan-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AIPLoanDetailsComponent implements OnInit {
  rangeValue: any = 0;
  max = 1000000;
  min = 50000;
  grossIncome: boolean;
  minRangeValue: any = 12;
  minMonths: any = 12;
  maxMonths: any = 60;
  interestRate: any;
  emiMin: any = 8440;
  emiMax: any = 18644;
  emiChangeValue: any = this.emiMin;
  monthlyEmi: any;
  name: any;
  token: string;
  applicationId: any;
  optionsLkp: any;
  loanRequirements: any;
  approvalLoanAmount: any;
  maxloan: any;
  totalEmi: any;
  aipForm: FormGroup;
  aipDetails: any;
  processingFee: any;
  stampduty: any;
  gst: any;
  amountError = false;
  savedResponse: any;
  optionsKey: any;

  constructor(
    private service: ComponentInteractionService,
    public fb: FormBuilder,
    public validator: ValidatorService,
    public route: Router,
    public spinner: NgxSpinnerService,
    private genericService: GenericService
  ) { }

  ngOnInit(): void {
    this.form();
    this.getToken();
  }

  form() {
    this.aipForm = this.fb.group({
      loanSecure: this.validator.valid.prefix,
      insurance: this.validator.borrowerDetails.accountHolder,
    });
  }

  getToken(): void {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
    this.getLookUpValues();
    this.getAipLoanDetails();
  }

  getLookUpValues() {
    const secureYourLoan = {
      lookupName: 'PL OPTIONS'
    };
    this.genericService.getLookUpValues(secureYourLoan, this.token).subscribe(result => {
      this.optionsLkp = result;
      this.getSecureValue();
    });
  }

  getSecureValue(): void {
    this.optionsLkp.forEach((item) => {
      if (item.value === 'No') {
        this.aipForm.patchValue({
          loanSecure: 'No'
        });
        this.optionsKey = item.key
      }
    });
  }

  getAipLoanDetails() {
    const payload = {
      applicationId: this.applicationId
    };
    this.spinner.show();
    this.genericService.getAipDetails(payload, this.token).subscribe(result => {
      this.aipDetails = result;
      this.spinner.hide();

      this.approvalLoanAmount = localStorage.setItem('approvalLoan', this.aipDetails.approvalLoan);

      if (this.aipDetails && this.aipDetails.approvalLoan <= 50000) {
        this.maxMonths = 18;
      } else {
        this.maxMonths = 48;
      } 
      
      this.min = this.aipDetails.loanAmount < 50000 ? 10000 : this.min;
      this.name = this.aipDetails.applicantName ? this.aipDetails.applicantName : '';
      this.rangeValue = this.aipDetails.loanAmount ? this.aipDetails.loanAmount : this.rangeValue;
      this.minRangeValue = this.aipDetails.tenure ? this.aipDetails.tenure : this.minRangeValue;
      this.interestRate = this.aipDetails.interestRate === 0 ? "0" : this.aipDetails.interestRate;
      this.processingFee = this.aipDetails.processingFee === 0 ? "0" : this.aipDetails.processingFee;
      this.stampduty = this.aipDetails.stampduty === 0 ? "0" : this.aipDetails.stampduty;
      this.gst = this.aipDetails.gst ? this.aipDetails.gst : '';
      this.maxloan = this.aipDetails.maxLoan ? this.aipDetails.maxLoan : '',

        this.emiCalculation();
    }, error => {
      this.spinner.hide();
    });
  }

  showSelectValue(value) {
    if (value === 'Yes') {
      this.optionsLkp.forEach((item) => {
        if (item.value === 'Yes') {
          this.optionsKey = item.key
        }
      })
    } else {
      this.optionsLkp.forEach((item) => {
        if (item.value === 'No') {
          this.optionsKey = item.key
        }
      })
    }
  }

  emiCalculation() {
    const rightHandLogic: any = [1 - Math.pow((1 + this.aipDetails.interestRate / 1200), (-(this.minRangeValue)))]
    this.totalEmi = (this.rangeValue * this.aipDetails.interestRate / 1200) / rightHandLogic;
  }

  formatLabel(value: number): any {
    return value + 'Months';
  }

  formatThumbLabel(value: number): any {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  }

  Change(data): void {
    this.rangeValue = data.replace(',', '').replace(',', '').replace(',', '');
    if (this.rangeValue < 50000) {
      this.grossIncome = true;
    } else if (this.rangeValue > 1000000) {
      this.grossIncome = true;
    } else if (this.rangeValue === '') {
      this.amountError = true;
    } else {
      this.grossIncome = false;
    }
    this.emiCalculation();
  }

  emiChange(data) {
    this.emiChangeValue = data;
  }

  sliderValue(data) {
    this.rangeValue = data;
    this.grossIncome = false;
    this.emiCalculation();
  }

  monthsliderValue(data) {
    this.minRangeValue = data;
    this.emiCalculation();
  }

  emiSliderValue(data) {
    this.emiChangeValue = data;
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSubmit(): void {
    this.service.thankYou.next('offerForYou');
    const payload = {
      applicationId: this.applicationId,
      loanAmount: this.rangeValue,
      tenure: this.minRangeValue,
      loanSecure: this.optionsKey,
      roi: this.interestRate,
      processingFee: parseInt(this.processingFee),
      stampduty: this.stampduty,
      gst: parseInt(this.gst),
      emi: Math.floor(this.totalEmi),
      netLoanAmount: parseInt(this.aipDetails.netLoanAmount)
    };
    this.spinner.show();
    this.genericService.saveLoanRequirements(payload, this.token).subscribe(result => {
      this.savedResponse = result;
      this.spinner.hide();
      this.route.navigate(['/application-setup/basic-tnc']);
    }, error => {
      this.spinner.hide();
    });
  }
}
