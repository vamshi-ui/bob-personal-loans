import { Component, OnInit, ViewEncapsulation, OnChanges } from '@angular/core';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidatorService } from '../../../shared/validations/validator.service';
import { Router } from '@angular/router';
import { GenericService } from '../../../shared/services/generic.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { merge } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { ResendOtpDialogComponent } from '../../resend-otp-dialog/resend-otp-dialog.component';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BusinessDetailsComponent implements OnInit {

  popUpValues: { dropoffTempName: any; };
  saveCustomerScreenDetails: Object;
  businessForm: FormGroup;
  submitted = false;
  changeText: boolean;
  token: any;
  occupations: object;
  cities: object;
  states: object;
  affiliations: object;
  countries: object;
  districts: any;
  pincodeLookup: any;
  getStateAndCityByPincode: any;
  filteredOptions: any;
  applicationId: any;
  appPack: any;
  businessDetails: any;
  employeeBusiness: any;
  pincodeErr: boolean;
  selectPincodeErr: boolean;
  valid = true;
  salValue: any;
  emiVal: any;
  isValid: boolean;
  fetchBusinessDetails: any;
  empValidStatus: any;
  empIdAction: boolean;
  // error: boolean;
  validCheckBox: boolean;
  showAffliation: boolean;
  businessNatureLkp: any;
  disableAction: boolean;
  pincodeDetails: any;
  validEmi: boolean;

  constructor(private service: ComponentInteractionService,
    private fb: FormBuilder,
    private validator: ValidatorService,
    public route: Router,
    public genericService: GenericService,
    private toastr: ToastrService,
    private dialogRef: MatDialog,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.businessDetailsForm();
    this.changeText = false;
    this.getToken();
    this.getLookups();
    this.getBusinessDetails();
    this.showText();
    this.resetCheckBox();
  }

  get f(): any {
    return this.businessForm.controls;
  }

  businessDetailsForm(): void {
    this.businessForm = this.fb.group({
      occupation: this.validator.valid.prefix,
      addressLine1: this.validator.valid.address,
      addressLine2: this.validator.valid.address,
      pincode: this.validator.valid.pincode,
      city: this.validator.valid.prefix,
      district: this.validator.valid.prefix,
      state: this.validator.valid.prefix,
      country: this.validator.valid.prefix,
      affiliation: '',
      affiliationId: this.validator.valid.affiliationId,
      annualIncome: this.validator.valid.salery,
      businessNature: this.validator.valid.prefix,
      obligation: this.validator.valid.obligation,
      checkBox: this.validator.valid.checkBox
    });
  }

  resetCheckBox(): void {
    const mergeValues = merge(
      this.businessForm.get('occupation').valueChanges,
      this.businessForm.get('addressLine1').valueChanges,
      this.businessForm.get('addressLine2').valueChanges,
      this.businessForm.get('pincode').valueChanges,
      this.businessForm.get('city').valueChanges,
      this.businessForm.get('district').valueChanges,
      this.businessForm.get('state').valueChanges,
      this.businessForm.get('country').valueChanges,
      this.businessForm.get('annualIncome').valueChanges,
      this.businessForm.get('businessNature').valueChanges,
      this.businessForm.get('obligation').valueChanges
    );
    mergeValues.subscribe(() => {
      this.businessForm.get('checkBox').reset()
    });
  }

  onCheck(event): void {
    if (event.checked === true) {
      this.validCheckBox = true;
    } else {
      this.validCheckBox = false;
    }
  }

  checkBoxValidation(): void {
    if (this.businessForm.get('checkBox').invalid) {
      this.validCheckBox = false;
    }
    else {
      this.validCheckBox = true;
    }
  }

  enableId(value): void {
    if (value) {
      this.showAffliation = true;
      this.businessForm.get('affiliationId').enable();
      this.businessForm.get('affiliationId').markAsUntouched();
    }
    else {
      this.showAffliation = false;
      this.businessForm.get('affiliationId').disable();
      this.businessForm.get('affiliationId').markAsUntouched();
    }
  }

  employIdValid(val): void {
    const payload = {
      affiliationType: this.businessForm.get('affiliation').value,
      affiliationID: val,
      applicationId: this.applicationId,
    };
    this.genericService.validateEmployeeId(payload, this.token).subscribe(res => {
      this.empValidStatus = res;
      if (this.empValidStatus.status === 'SUCCESS') {
        this.empIdAction = true;
      } else {
        this.empIdAction = false;
      }
    });
  }

  alphaSpaceOnly(event): boolean {
    const inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  getToken(): void {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
    this.appPack = localStorage.getItem('appPack');
  }

  getLookups(): void {
    const occupation = {
      lookupName: 'OCCUPATION'
    };
    this.genericService.getLookUpValues(occupation, this.token).subscribe(result => {
      this.occupations = result;
    });
    const city = {
      lookupName: 'CITY LOOKUP'
    };
    this.genericService.getLookUpValues(city, this.token).subscribe(result => {
      this.cities = result;
    });

    const district = {
      lookupName: 'DISTRICT'
    };
    this.genericService.getLookUpValues(district, this.token).subscribe(result => {
      this.districts = result;
    });

    const state = {
      lookupName: 'STATE LOOKUP'
    };
    this.genericService.getLookUpValues(state, this.token).subscribe(result => {
      this.states = result;
    });
    const affiliation = {
      lookupName: 'AFFILIATION SELECTION'
    };
    this.genericService.getLookUpValues(affiliation, this.token).subscribe(result => {
      this.affiliations = result;
    });
    const businessNature = {
      lookupName: 'TYPE OF ACTIVITY'
    };
    this.genericService.getLookUpValues(businessNature, this.token).subscribe(result => {
      this.businessNatureLkp = result;
    });
    const country = {
      lookupName: 'COUNTRY LOOKUP'
    };
    this.genericService.getLookUpValues(country, this.token).subscribe(result => {
      this.countries = result;
    });
  }

  getPincodeDetails(val): void {
    if (val.length === 6) {
      const pincodeForCityState = {
        pincode: val
      };
      this.spinner.show();
      this.genericService.getStateandCityByPincode(pincodeForCityState, this.token).subscribe((result) => {
        this.spinner.hide();
        this.getStateAndCityByPincode = result;
        if (this.getStateAndCityByPincode.status === 'Success') {
          this.pincodeErr = true;
          this.disableAction = true;
          this.businessForm.patchValue({
            city: this.getStateAndCityByPincode.city,
            state: this.getStateAndCityByPincode.state,
            district: this.getStateAndCityByPincode.district,
            country: this.getStateAndCityByPincode.country
          });
        } else {
          this.pincodeErr = false;
          this.disableAction = false;
          this.businessForm.patchValue({
            city: '',
            state: '',
            district: '',
            country: ''
          });
        }
      }, err => {
        this.spinner.hide();
      });
    } else {
      this.pincodeErr = false;
      this.disableAction = false;
      this.businessForm.patchValue({
        city: '',
        state: '',
        district: '',
        country: ''
      });
    }
  }

  keyPressIncome(val): boolean {
    const inp = String.fromCharCode(val.keyCode);

    if (/[0-9]/.test(inp)) {
      return true;
      this.isValid = true;
    } else {
      val.preventDefault();
      return false;
    }
    this.isValid = false;
  }

  showText(): void {
    if (!this.businessForm.get('annualIncome').touched) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }


  salary(): void {
    // this.businessForm.get('annualIncome').valueChanges.subscribe(res => {
    //   const value = res;
    //   if (value !== '') {
    //     this.salValue = +value.split(',').join('');
    //   }
    //   if (this.businessForm.get('obligation').value.split('').slice(0, 1)[0] !== '0') {
    //     this.validEmi = false;
    //     this.error = false;
    //     if (this.salValue <= this.emiVal) {
    //       this.error = false;
    //     } else {
    //       this.error = true;
    //     }
    //   } else {
    //     if (this.businessForm.value.obligation.length === 1 && this.businessForm.get('obligation').value.split('').slice(0, 1)[0] === '0') {
    //       this.validEmi = false;
    //     } else if (this.businessForm.value.obligation.length > 1 && this.businessForm.get('obligation').value.split('').slice(0, 1)[0] === '0') {
    //       this.validEmi = true;
    //     }
    //   }
    // });

    this.salValue = +this.businessForm.value.annualIncome.split(',').join('');
    this.emiVal = +this.businessForm.value.obligation.split(',').join('');

    if (this.businessForm.value.obligation !== '') {
      if (this.businessForm.get('obligation').value.split('').slice(0, 1)[0] !== '0') {
        this.validEmi = false;
        // this.error = false;
        // if (this.salValue <= this.emiVal) {
        //   this.error = true;
        // }
      } else if (this.businessForm.value.obligation.length === 1 && this.businessForm.get('obligation').value.split('').slice(0, 1)[0] === '0') {
        this.validEmi = false;
      } else if (this.businessForm.value.obligation.length > 1 && this.businessForm.get('obligation').value.split('').slice(0, 1)[0] === '0') {
        this.validEmi = true;
      }
    }
  }

  validationLookup(): void {
    if (this.businessForm.get('occupation').value === '0') {
      this.businessForm.get('occupation').reset();
    }
    if (this.businessForm.get('state').value === '0') {
      this.businessForm.get('state').reset();
    }
    if (this.businessForm.get('city').value === '0') {
      this.businessForm.get('city').reset();
    }
    if (this.businessForm.get('district').value === '0') {
      this.businessForm.get('district').reset();
    }
    if (this.businessForm.get('country').value === '0') {
      this.businessForm.get('country').reset();
    }
    if (this.businessForm.get('affiliation').value === '0') {
      this.businessForm.get('affiliation').reset();
    }
    if (this.businessForm.get('businessNature').value === '0') {
      this.businessForm.get('businessNature').reset();
    }
  }

  getBusinessDetails(): void {
    const emp = {
      applicationId: this.applicationId
    };
    this.genericService.getEmploymentDetails(emp, this.token).subscribe(res => {
      this.businessDetails = res;
      this.getFetchedBusinessDetails();
    });
  }

  getFetchedBusinessDetails(): void {
    this.businessForm.patchValue({
      occupation: this.businessDetails.empType !== null ? this.businessDetails.empType.toString() : '',
      addressLine1: this.businessDetails.workAdrressline1,
      addressLine2: this.businessDetails.workAdrressline2,
      pincode: this.businessDetails.pincode,
      affiliation: this.businessDetails.affilication !== null ? this.businessDetails.affilication.toString() : '',
      annualIncome: this.businessDetails.monthlySalary !== null ? this.businessDetails.monthlySalary.toString() : '',
      businessNature: this.businessDetails.natureOfBusiness !== null ? this.businessDetails.natureOfBusiness.toString() : '',
      obligation: this.businessDetails.emiObligation !== null ? this.businessDetails.emiObligation.toString() : '',
    });

    if (this.businessDetails.pincode !== null) {
      this.disableAction = true;
      const pincodeDetails = {
        pincode: this.businessDetails.pincode
      }
      this.genericService.getStateandCityByPincode(pincodeDetails, this.token).subscribe((result) => {
        this.pincodeDetails = result;
        this.pincodeErr = true;
        this.businessForm.patchValue({
          city: this.pincodeDetails.city.toString(),
          district: this.pincodeDetails.district.toString(),
          state: this.pincodeDetails.state.toString(),
          country: this.pincodeDetails.country.toString(),
        })
      })
    } else {
      this.disableAction = false;
    }

    if (this.businessDetails.identificationId !== null) {
      this.showAffliation = true;
      this.businessForm.patchValue({
        affiliationId: this.businessDetails.identificationId
      })
    }
  }

  saveBusinessDetails(): void {
    this.salary();
    const emp = {
      applicationId: parseInt(this.applicationId),
      employeeType: parseInt(this.businessForm.value.occupation),
      adderessLine1: this.businessForm.value.addressLine1,
      adderessLine2: this.businessForm.value.addressLine2,
      pincode: this.businessForm.value.pincode,
      state: parseInt(this.businessForm.value.state),
      city: parseInt(this.businessForm.value.city),
      district: parseInt(this.businessForm.value.district),
      country: parseInt(this.businessForm.value.country),
      netsalary: this.salValue,
      emiObligation: this.emiVal,
      identificationId: this.businessForm.value.affiliationId,
      natureOfBusiness: parseInt(this.businessForm.value.businessNature),
      affilication: this.businessForm.value.affiliation,
    };
    this.spinner.show();
    this.genericService.saveEmploymentDetails(emp, this.token).subscribe((res) => {
      const screenDetails = { "screenNumber": 7, "screenName": "Business details", "applicationId": this.applicationId, "product": "PL" }
      this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
      this.spinner.hide();
      this.employeeBusiness = res;
      if (this.employeeBusiness.fraudId === null || this.employeeBusiness.fraudId === 1) {
        if (this.employeeBusiness.dropoffFlag === false) {
          this.route.navigate(['/offers-for-you']);
        } else {
          this.popUpValues = {
            dropoffTempName: this.employeeBusiness.dropoffTempName,
          }
          this.service.dropoffValues.next(this.popUpValues)
          this.dialogRef.open(ResendOtpDialogComponent, { disableClose: true });
        }
      } else {
        this.route.navigate(['/offer-reject']);
      }
    }, err => {
      this.spinner.hide();
    });
  }


  showAffliationID(): void {
    if (this.showAffliation === true) {
      this.businessForm.get('affiliationId').enable();
      this.businessForm.get('affiliationId').markAsTouched();
    }
    else {
      this.businessForm.get('affiliationId').disable();
      this.businessForm.get('affiliationId').markAsUntouched();
    }
  }

  onSubmit(): void {
    this.checkBoxValidation();
    this.showAffliationID();
    this.validationLookup();
    this.salary();
    if (this.businessForm.valid && this.validEmi === false && this.pincodeErr === true) {
      this.service.businessDetails.next(this.businessForm.value);
      this.isValid = true;
      this.service.offerForYou.next(29.5);
      this.service.offerForYou1.next(24);
      this.saveBusinessDetails();
    }
    else {
      this.isValid = false;
      this.toastr.error('Please fill all the details', '', { timeOut: 5000 });
    }
  }

  goBack(): void {
    this.route.navigate(['/user-input/customer-details']);
  }
}
