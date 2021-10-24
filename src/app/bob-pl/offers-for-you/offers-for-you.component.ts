import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { ValidatorService } from 'src/app/shared/validations/validator.service';
import { GenericService } from '../../shared/services/generic.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-offers-for-you',
  templateUrl: './offers-for-you.component.html',
  styleUrls: ['./offers-for-you.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OffersForYouComponent implements OnInit {
  getPrimaryDetails: any;
  saveCustomerScreenDetails: Object;
  approvalLoanAmount: void;
  accountHolder: any;
  rangeValue: any = 50000;

  min = 50000;
  grossIncome: boolean;
  gross: boolean;
  minRangeValue: any = 12;
  minMonths= 12;
  maxMonths: any;
  interestRate: any;
  emiMin: any = 8440;
  emiMax: any = 18644;
  emiChangeValue: any = this.emiMin;
  monthlyEmi: any;
  insurancePremium: any;
  offerForyouForm: FormGroup;
  changeText: boolean;
  optionsLkp: any;
  token: any;
  loanRequirements: any;
  saveLoanRequirementData: any;
  applicationId: any;
  disableAction = false;
  insuranceValue = false;
  loginID: number;
  loginDetails: any;
  salValue: any;
  fetchOfferDetails: any;
  optionsKey: any;
  custData: any;
  totalEmi: number = 0;
  ROI: any;
  maxloan: any;
  getCustomerCommonDetails: any;

  constructor(
    private service: ComponentInteractionService,
    public fb: FormBuilder,
    public validator: ValidatorService,
    public route: Router,
    private genericService: GenericService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.form();
    this.changeText = false;
    this.getToken();
    this.getLookUpValues();
    this.getLoanRequirements();
    // this.disabledFields();
    this.loginId();
    this.emiCalculation();
  }


  loginId() {
    this.loginDetails = localStorage.getItem('applicationId');
  }

  // disabledFields(): void {
  //   this.offerForyouForm.get('insurance').disable();
  // }

  form() {
    this.offerForyouForm = this.fb.group({
      loanSecure: ['', Validators.required],
      // insurance: this.validator.borrowerDetails.accountHolder,
      loanAmount: ['50000', [Validators.required, Validators.pattern(`^[1-9][0-9,]*$`)]]
    });
  }


  getSecureValue(): void {
    this.optionsLkp.forEach((item) => {
      if (item.value === 'No') {
        this.offerForyouForm.patchValue({
          loanSecure: 'No'
        });
        this.optionsKey = item.key
      }
    });
  }

  formatLabel(value: number): any {
    return value + ' ' + 'months';
  }

  formatThumbLabel(value: number): any {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  }

  // selectLoan(event) {
  //   if (event.value === 'Yes') {
  //     this.offerForyouForm.get('insurance').enable();
  //   } else {
  //     this.offerForyouForm.get('insurance').disable();
  //     this.offerForyouForm.get('insurance').reset();
  //   }
  // }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  Change(data): void {
    this.rangeValue = data.replace(',', '').replace(',', '').replace(',', '');
    if (data === '') {
      this.gross = true;
    } else if (this.rangeValue < 50000 || this.rangeValue > this.maxloan) {
      this.grossIncome = true;
      this.gross = false;
    } else {
      this.gross = false;
      this.grossIncome = false;
    }
    this.emiCalculation()
    // this.totalEmi = (loan amount selected in screen * ROI/1200 ) / [1 - (1 + ROI/1200)^(-(tenor/12))]
  }

  emiChange(data) {
    this.emiChangeValue = data;
  }

  sliderValue(data) {
    this.rangeValue = data;
    this.grossIncome = false;
    this.gross = false;
    if (!this.offerForyouForm.get('loanAmount').valid) {
      this.offerForyouForm.get('loanAmount').reset();
    }
    this.emiCalculation()
  }

  monthsliderValue(data) {
    this.minRangeValue = data;
    this.emiCalculation();
  }
  emiSliderValue(data) {
    this.emiChangeValue = data;
  }

  insuranceAmount(value) {
    this.insurancePremium = value;
  }

  showSelectValue(val) {
    if (val === 'Yes') {
      // this.insuranceValue = true;
      // this.offerForyouForm.get('insurance').enable();
      // for (let i = 0; i <= this.optionsLkp.length; i++) {
      //   if (this.optionsLkp[i].value === 'Yes') {
      //     this.optionsKey = this.optionsLkp[i].key;
      //   }
      // }
      this.optionsLkp.forEach((item) => {
        if (item.value === 'Yes') {
          this.optionsKey = item.key
        }
      })
    } else {
      // this.insuranceValue = false;
      // this.offerForyouForm.get('insurance').disable();
      // for (let i = 0; i <= this.optionsLkp.length; i++) {
      //   if (this.optionsLkp[i].value === 'No') {
      //     this.optionsKey = this.optionsLkp[i].key;
      //   }
      // }
      this.optionsLkp.forEach((item) => {
        if (item.value === 'No') {
          this.optionsKey = item.key
        }
      })
    }
  }

  getToken(): void {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
    this.getCommonData();
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

  getCommonData() {
    const data =
    {
      'applicationId': this.applicationId
    }
    this.genericService.getCustomerStatus(data, this.token).subscribe(x => { this.getCustomerCommonDetails = x })
  }

  getLoanRequirements() {
    const payload = {
      applicationId: this.applicationId
    };
    this.genericService.getOfferDetails(payload, this.token).subscribe(result => {
      this.loanRequirements = result;

      this.service.rejectTemplate.next(this.loanRequirements.output);

      // if(this.loanRequirements.maxLoan <= 50000 || this.loanRequirements.maxLoan === null ||
      //   this.loanRequirements.loanAmount > this.loanRequirements.maxLoan || this.loanRequirements.output === "REJECT") {
        
      if (this.loanRequirements.output === "REJECT" || this.loanRequirements.output === null) {
        this.route.navigate(['/offer-reject']);
        return;
      } else if (this.loanRequirements.output === "REFER") {
        this.route.navigate(['/offer-reject']);
        return;
      }

      this.approvalLoanAmount = localStorage.setItem('approvalLoan', this.loanRequirements.approvalLoan);

      this.rangeValue = this.loanRequirements.approvalLoan ? this.loanRequirements.approvalLoan : this.rangeValue;
      this.minRangeValue = this.loanRequirements.tenure ? this.loanRequirements.tenure : this.minRangeValue;
      this.monthlyEmi = this.loanRequirements.emi ? this.loanRequirements.emi : "0";
      this.interestRate = this.loanRequirements.roi ? this.loanRequirements.roi : this.interestRate;
      this.maxloan = this.loanRequirements.maxLoan;
      this.maxMonths = this.loanRequirements.maxTenure;
      this.emiCalculation();
    }, error => {
    });
  }

  // OfferSavedDetails() {
  //   this.service.offerDetails.subscribe((x => {
  //     this.fetchOfferDetails = x;
  //     if (this.fetchOfferDetails) {
  //       this.getFetchedOfferDetails();
  //     }
  //   }))
  // }

  // getFetchedOfferDetails() {
  //   this.offerForyouForm.patchValue({
  //     loanSecure: this.fetchOfferDetails.loanSecure,
  //     loanAmount: this.fetchOfferDetails.loanAmount
  //   });
  // if (this.fetchOfferDetails.loanSecure === 'Yes') {
  //   this.offerForyouForm.get('insurance').enable();
  //   this.insuranceValue = true;
  //   this.offerForyouForm.patchValue({
  //     insurance: this.fetchOfferDetails.insurance,
  //   });
  // } else {
  //   this.insuranceValue = false;
  //   this.offerForyouForm.get('insurance').disable();
  // }

  // }

  // premiumAmount() {
  //   if (this.offerForyouForm.get('loanSecure').value === 'Yes') {
  //     this.offerForyouForm.value.insurance.split(',').map((val, _, arr) => {
  //       this.salValue = +arr.join('');
  //     });
  //   }
  // }

  // goBack() {
  //   this.service.customerDetailsShare.subscribe((data) => {
  //     this.custData = data;
  //     console.log("data", this.custData)
  //   });

  //   if (this.custData.jobType === 'Salaried') {
  //     this.route.navigate(['/user-input/employment-details']);
  //   } else {
  //     this.route.navigate(['/user-input/business-details']);
  //   }
  // }

  /**
   * This function is to calculate Emi 
   */
  emiCalculation() {
    const rightHandLogic: any = [1 - Math.pow((1 + this.interestRate / 1200), (-(this.minRangeValue)))]
    this.totalEmi = (this.rangeValue * this.interestRate / 1200) / rightHandLogic

  }

  onSubmit(): void {
    if (this.offerForyouForm.valid && !this.grossIncome && !this.gross) {
      this.service.offerDetails.next(this.offerForyouForm.value);
      this.service.loanAmount.next(this.rangeValue);
      const payload = {
        applicationId: parseInt(this.applicationId),
        loanAmount: this.rangeValue,
        tenure: this.minRangeValue,
        loanSecure: this.optionsKey,
        emi: Math.floor(this.totalEmi),
        roi: this.interestRate,
      };
      this.spinner.show();
      

      this.genericService.saveOfferDetails(payload, this.token).subscribe(result => {
        this.spinner.hide();
        const screenDetails = { "screenNumber": 27, "screenName": "Offers for you", "applicationId": this.applicationId, "product": "PL" }
        this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
        this.saveLoanRequirementData = result;

       
          if (this.getCustomerCommonDetails.accountHolder == 'No') {
            this.route.navigate(['/application-setup/provide-bank-statements']);
          }
          else {
            const data = { "applicationId": this.applicationId }
            this.spinner.show();
            this.genericService.getPrimaryAccountDetails(data, this.token).subscribe(x => {
              this.getPrimaryDetails = x;
              this.spinner.hide();
              if(this.getPrimaryDetails.accDtls.length == 0)
              {
                this.route.navigate(['/application-setup/provide-bank-statements']);
              }
              else
              {
                this.route.navigate(['/application-setup/primary-account']);
              }
            
          }, err => { 
            this.spinner.hide();
          });
          }
        

      }, error => {
        this.spinner.hide();
      });
      this.service.thankYou.next(30.5);
      this.service.thankYou1.next(25);
    } else {
      return;
    }
  }
}
