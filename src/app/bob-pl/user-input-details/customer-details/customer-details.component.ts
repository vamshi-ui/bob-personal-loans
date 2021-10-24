import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { ValidatorService } from 'src/app/shared/validations/validator.service';
import { GenericService } from '../../../shared/services/generic.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/format-datepicker';
import { NgxSpinnerService } from 'ngx-spinner';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { ResendOtpDialogComponent } from '../../resend-otp-dialog/resend-otp-dialog.component';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.

    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ,
    DatePipe
  ],
})

export class CustomerDetailsComponent implements OnInit {
  popUpValues: {};
  saveCustomerScreenDetails: Object;
  aadharGetting: boolean = false;
  customerDetailsForm: FormGroup;
  visibleRequiredError: boolean;
  spouseName = false;
  maxDate = new Date();
  minDate = new Date('1961');
  token: any;
  salutationLkp: any;
  panVerifyDetails: any;
  genderLkp: object;
  jobTypeLkp: any;
  categotyLkp: object;
  religionLkp: object;
  maritalStatusLkp: any;
  cityLkp: object;
  districtLkp: object;
  stateLkp: object;
  countryLkp: object;
  branchLkp: object;
  pincodeLookup: any;
  residentialstatusLkp: any;
  getStateAndCityByPincode: any;
  getStateAndCityByPincodeTwo: any;
  filteredOptions: any;
  filteredOptionsOne: any;
  appId: any;
  getcustomerDetails: any;
  savedetails: any;
  appPackId: any;
  disableAction = false;
  disableActionBranch = false;
  pincodeError: boolean;
  pincodeErrorTwo: boolean;
  hasName = false;
  getBranchDetails: any;
  branchAddress: any;
  applicationId: any;
  appPackageId: any;
  fetchCustomerDetails: any;
  borrowerDetails: any;
  hasNameOne: boolean;
  hasNameTwo: boolean;
  maritalStatusKey: any;
  jobTypeKey: any;
  dob: any;
  age: number;
  verifyPan = false;
  finalDate: Date;
  firstNameDisable: boolean;
  lastNameDisable: boolean;
  middleNameDisable: boolean;

  aadharVal: any = '';
  aadharVisible: boolean;
  maritalStatusValue: any;
  jobTypeValue: any;
  citiesByPincodeOne: any;
  aadharVisibleHide = false;
  checkBoxTickStatus = false;
  residentInvalid = false;
  disableField: boolean;
  validAadharLength: boolean;
  invalidAadhaar: boolean;
  cpId: any;
  hasPermanentAddress = false;

  constructor(
    public fb: FormBuilder,
    public route: Router,
    private service: ComponentInteractionService,
    public validator: ValidatorService,
    public genericService: GenericService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialog,
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.form();
    this.getToken();
    this.getLookUpValues();
  }

  getToken(): void {
    this.token = localStorage.getItem('token');
    this.appId = localStorage.getItem('applicationId');
    this.appPackId = localStorage.getItem('appPackId');
  }

  getLookUpValues(): void {
    const salutation = {
      lookupName: 'SALUTATION'
    };
    this.genericService.getLookUpValues(salutation, this.token).subscribe(result => {
      this.salutationLkp = result;
    });

    const gender = {
      lookupName: 'GENDER'
    };
    this.genericService.getLookUpValues(gender, this.token).subscribe(result => {
      this.genderLkp = result;
    });

    const jobType = {
      lookupName: 'JOB TYPE'
    };
    this.genericService.getLookUpValues(jobType, this.token).subscribe(result => {
      this.jobTypeLkp = result;
    });

    const categoty = {
      lookupName: 'CATEGORY CASTE'
    };
    this.genericService.getLookUpValues(categoty, this.token).subscribe(result => {
      this.categotyLkp = result;
    });

    const religion = {
      lookupName: 'RELIGION/COMMUNITY'
    };
    this.genericService.getLookUpValues(religion, this.token).subscribe(result => {
      this.religionLkp = result;
    });

    const maritalstatus = {
      lookupName: 'MARITAL STATUS'
    };
    this.genericService.getLookUpValues(maritalstatus, this.token).subscribe(result => {
      this.maritalStatusLkp = result;
    });

    const residentialstatus = {
      lookupName: 'RESIDENTIAL STATUS'
    };
    this.genericService.getLookUpValues(residentialstatus, this.token).subscribe(result => {
      this.residentialstatusLkp = result;
    });

    const city = {
      lookupName: 'CITY LOOKUP'
    };
    this.genericService.getLookUpValues(city, this.token).subscribe(result => {
      this.cityLkp = result;
    });

    const district = {
      lookupName: 'DISTRICT'
    };
    this.genericService.getLookUpValues(district, this.token).subscribe(result => {
      this.districtLkp = result;
    });

    const state = {
      lookupName: 'STATE LOOKUP'
    };
    this.genericService.getLookUpValues(state, this.token).subscribe(result => {
      this.stateLkp = result;
    });

    const country = {
      lookupName: 'COUNTRY LOOKUP'
    };
    this.genericService.getLookUpValues(country, this.token).subscribe(result => {
      this.countryLkp = result;
    });

    setTimeout(() => {
      this.getCustomerDetails();
    }, 2000)
  }

  form() {
    this.customerDetailsForm = this.fb.group(
      {
        prefix: this.validator.customerDetails.prefix,
        firstName: this.validator.customerDetails.firstName,
        middleName: this.validator.valid.middleName,
        lastName: this.validator.valid.lastName,
        DOB: this.validator.customerDetails.DOB,
        gender: this.validator.customerDetails.prefix,
        PAN: this.validator.customerDetails.PAN,
        jobType: this.validator.customerDetails.prefix,
        email: this.validator.customerDetails.email,
        category: this.validator.customerDetails.prefix,
        religion: this.validator.customerDetails.prefix,
        residentialStatus: this.validator.customerDetails.prefix,
        maritalStatus: this.validator.customerDetails.prefix,
        spouseName: this.validator.customerDetails.spouse,
        AddressOne: [
          '',
          [
            Validators.required,
            // Validators.pattern(`^[a-zA-Z0-9/ \\\\'.,-]*$`),
            Validators.pattern(`^[a-zA-Z0-9!%@#'$&( )-~^*\_|{}:?<>.+,/"]*$`),
            Validators.minLength(1),
            Validators.maxLength(100),
          ],
        ],
        AddressTwo: [
          '',
          [
            Validators.required,
            // Validators.pattern(`^[a-zA-Z0-9/ \\\\'.,-]*$`),
            Validators.pattern(`^[a-zA-Z0-9!%@#'$&( )-~^*\_|{}:?<>.+,/"]*$`),
            Validators.minLength(1),
            Validators.maxLength(100),
          ],
        ],
        pincode: this.validator.customerDetails.pincode,
        city: this.validator.customerDetails.prefix,
        district: this.validator.customerDetails.prefix,
        state: this.validator.customerDetails.prefix,
        country: this.validator.customerDetails.prefix,
        AddressOneTwo: [
          '',
          [
            Validators.required,
            // Validators.pattern(`^[a-zA-Z0-9/ \\\\'.,-]*$`),
            Validators.pattern(`^[a-zA-Z0-9!%@#'$&( )-~^*\_|{}:?<>.+,/"]*$`),
            Validators.minLength(1),
            Validators.maxLength(100),
          ],
        ],
        AddressTwoTwo: [
          '',
          [
            Validators.required,
            // Validators.pattern(`^[a-zA-Z0-9/ \\\\'.,-]*$`),
            Validators.pattern(`^[a-zA-Z0-9!%@#'$&( )-~^*\_|{}:?<>.+,/"]*$`),
            Validators.minLength(1),
            Validators.maxLength(100),
          ],
        ],
        pincodeTwo: this.validator.customerDetails.pincode,
        cityTwo: this.validator.customerDetails.prefix,
        district1: this.validator.customerDetails.prefix,
        state1: this.validator.customerDetails.prefix,
        country1: this.validator.customerDetails.prefix,
        branchName: this.validator.customerDetails.prefix,
        branchAddress1: this.validator.customerDetails.prefix,
        mobile: this.validator.valid.mobileNumber,
        aadharNumber: this.validator.customerDetails.AadharNumber,
        checkBox: false,
      },
    );
  }

  validPinCode(val) {
    if (val.length === 6) {
      const pincodeForCityState = {
        pincode: val
      };
      this.genericService.getStateandCityByPincode(pincodeForCityState, this.token).subscribe(result => {
        this.getStateAndCityByPincode = result;
        if (this.getStateAndCityByPincode.status === 'Success') {
          this.pincodeError = true;
          this.customerDetailsForm.patchValue({
            city: this.getStateAndCityByPincode.city,
            state: this.getStateAndCityByPincode.state,
            district: this.getStateAndCityByPincode.district,
            country: this.getStateAndCityByPincode.country
          });
        } else {
          this.pincodeError = false;
          this.customerDetailsForm.patchValue({
            city: '',
            state: '',
            district: '',
            country: '',
          });
        }
      });
    }
    else {
      this.pincodeError = false;
      this.customerDetailsForm.patchValue({
        city: '',
        state: '',
        district: '',
        country: '',
      });
    }
  }

  validPincodeTwo(val) {
    if (val.length === 6) {
      const pincodeForCityState = {
        pincode: val
      };
      this.genericService.getStateandCityByPincode(pincodeForCityState, this.token).subscribe(result => {
        this.getStateAndCityByPincodeTwo = result;
        if (this.getStateAndCityByPincodeTwo.status === 'Success') {
          this.pincodeErrorTwo = true;
          this.disableField = true;
          this.customerDetailsForm.patchValue({
            cityTwo: this.getStateAndCityByPincodeTwo.city,
            state1: this.getStateAndCityByPincodeTwo.state,
            district1: this.getStateAndCityByPincodeTwo.district,
            country1: this.getStateAndCityByPincodeTwo.country
          });
          this.getBranchDetailsByPincode(val);
        } else {
          this.pincodeErrorTwo = false;
          this.disableField = false;
          this.customerDetailsForm.patchValue({
            cityTwo: '',
            state1: '',
            district1: '',
            country1: '',
            branchName: '',
            branchAddress1: ''
          });
        }
      });
    }
    else {
      this.pincodeErrorTwo = false;
      this.disableField = false;
      this.customerDetailsForm.patchValue({
        cityTwo: '',
        state1: '',
        district1: '',
        country1: '',
        branchName: '',
        branchAddress1: ''
      });
      this.customerDetailsForm.get('branchAddress1').reset();
      this.customerDetailsForm.get('branchName').reset();
      this.getBranchDetails = [];
      this.customerDetailsForm.get('branchName').markAsUntouched();
    }
  }


  panVerify(value): void {
    if (value.length == '10') {
      if (!this.customerDetailsForm.get('PAN').hasError('pattern') &&
        !this.customerDetailsForm.get('PAN').hasError('panName')) {
        this.genericService.panService(value, this.token).subscribe(result => {
          this.panVerifyDetails = result;
          if (this.panVerifyDetails.Status == 'Valid') {
            this.verifyPan = true;
          }
          else {
            this.verifyPan = false;
            this.toastr.error('PAN Number is Invalid', '', { timeOut: 5000 });
          }
        }, error => {
          this.verifyPan = false;
        });
      }
    } else {
      this.verifyPan = false;
    }
  }

  allowOnlyNumbers(event): boolean {
    const value = String.fromCharCode(event.keyCode);
    if (/[0-9]/.test(value)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  aadhaarValue(val): void {
    if (val.length > 12 && val.length < 16 && this.customerDetailsForm.get('aadharNumber').touched || val.length === 13) {
      this.invalidAadhaar = true;
    }
    if (val.length === 12) {
      const value = val.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
      this.aadharVal = value.slice(0, 14);
    } else if (val.length === 8) {
      const value = val.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
      this.aadharVal = value.slice(0, 9);
    } else if (val.length === 4) {
      const value = val.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
      this.aadharVal = value.slice(0, 4);
    } else {
      const value = val.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
      this.aadharVal = value.slice(0, 19);
    }
    if (val.length === 16 || val.length === 12) {
      this.invalidAadhaar = false;
    }
  }

  aadhaarVidValidation(): void {
    if (this.customerDetailsForm.get('aadharNumber').value.length === 12) {
      console.log(this.customerDetailsForm.get('aadharNumber').value.split('').slice(0, 1));
      if (this.customerDetailsForm.get('aadharNumber').value.split('').slice(0, 1)[0] === "1" ||
        this.customerDetailsForm.get('aadharNumber').value.split('').slice(0, 1)[0] === "0") {
        this.invalidAadhaar = true;
      } else if (this.customerDetailsForm.get('aadharNumber').value.match(/^(\d)\1+$/g)) {
        this.invalidAadhaar = true;
      }
    }
    else if (this.customerDetailsForm.get('aadharNumber').value.length === 16) {
      if (this.customerDetailsForm.get('aadharNumber').value.split('').slice(0, 1)[0] === "1" ||
        this.customerDetailsForm.get('aadharNumber').value.split('').slice(0, 1)[0] === "0") {
        this.invalidAadhaar = false;
      } else if (this.customerDetailsForm.get('aadharNumber').value.match(/^(\d)\1+$/g)) {
        this.invalidAadhaar = true;
      }
    }
  }

  fetchedAadhaar(val): void {
    if (val && val.length === 14) {
      if (val.length === 14) {
        this.invalidAadhaar = false;
        const value = val.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
        this.aadharVal = value.slice(0, 14);
      } else if (val.length === 8) {
        const value = val.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
        this.aadharVal = value.slice(0, 9);
      } else if (val.length === 4) {
        const value = val.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
        this.aadharVal = value.slice(0, 4);
      } else {
        const value = val.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
        this.aadharVal = value.slice(0, 19);
      }
    }
    if (val) {
      if (val.length === 12 || val.length === 16) {
        if (val.length === 12) {
          this.invalidAadhaar = false;
          const value = val.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
          this.aadharVal = value.slice(0, 14);
        } else if (val.length === 8) {
          const value = val.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
          this.aadharVal = value.slice(0, 9);
        } else if (val.length === 4) {
          const value = val.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
          this.aadharVal = value.slice(0, 4);
        } else {
          const value = val.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
          this.aadharVal = value.slice(0, 19);
        }
      }
    }

  }

  onlyNumbers(event): boolean {
    const inp = String.fromCharCode(event.keyCode);
    if (/[0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  getCustomerDetails(): void {
    if (this.applicationId) {

    } else {
      const customerDetails = {
        applicationId: this.appId
      };
      this.genericService.getCustomerDetails(customerDetails, this.token).subscribe(result => {
        this.spinner.hide();
        this.getcustomerDetails = result;

        if (this.getcustomerDetails.jobType) {
          this.jobTypeLkp.forEach(element => {
            if (element.key === this.getcustomerDetails.jobType) {
              this.jobTypeValue = element.value;
              this.jobTypeKey = element.key;
            }
          });
        }

        if (this.getcustomerDetails.maritalStatus) {
          this.maritalStatusLkp.forEach(element => {
            if (element.key === this.getcustomerDetails.maritalStatus) {
              this.maritalStatusValue = element.value
            }
          });
          if (this.maritalStatusValue === 'Married') {
            // this.spouseName = true;
            // this.customerDetailsForm.get('spouseName').enable();
          } else {
            // this.customerDetailsForm.get('spouseName').disable();
          }
        }

        if (this.getcustomerDetails.addressAsAbove === true) {
          this.disableAction = true;
          this.disableField = true;
        } else {
          this.disableAction = false;
          this.disableField = false;
        }

        this.customerDetailsForm.patchValue({
          prefix: this.getcustomerDetails.salutation ? this.getcustomerDetails.salutation.toString() : '',
          firstName: this.getcustomerDetails.firstName ? this.getcustomerDetails.firstName : '',
          middleName: this.getcustomerDetails.middleName ? this.getcustomerDetails.middleName : '',
          lastName: this.getcustomerDetails.lastName ? this.getcustomerDetails.lastName : '',
          DOB: this.getcustomerDetails.dateOfbirth ? _moment(this.getcustomerDetails.dateOfbirth, 'DD-MM-YYYY').toDate() : '',
          gender: this.getcustomerDetails.gender ? this.getcustomerDetails.gender.toString() : '',
          PAN: this.getcustomerDetails.panNo ? this.getcustomerDetails.panNo : '',
          jobType: this.getcustomerDetails.jobType ? this.jobTypeValue : '',
          category: this.getcustomerDetails.category ? this.getcustomerDetails.category.toString() : '',
          religion: this.getcustomerDetails.religion ? this.getcustomerDetails.religion.toString() : '',
          residentialStatus: this.getcustomerDetails.residentialStatus ? this.getcustomerDetails.residentialStatus.toString() : '',
          maritalStatus: this.getcustomerDetails.maritalStatus ? this.maritalStatusValue : '',
          mobile: this.getcustomerDetails.mobileNo ? this.getcustomerDetails.mobileNo : '',
          email: this.getcustomerDetails.email ? this.getcustomerDetails.email : '',
          spouseName: this.getcustomerDetails.spouseName ? this.getcustomerDetails.spouseName : '',
          checkBox: this.getcustomerDetails.addressAsAbove ? this.getcustomerDetails.addressAsAbove : false
        });

        this.genericService.getCustomerStatus(customerDetails, this.token).subscribe((result) => {
          this.borrowerDetails = result;

          if (this.borrowerDetails.accountHolder == "No" && this.getcustomerDetails.aadharNumber !== null) { //temp disable
            // if (this.borrowerDetails.accountHolder == "No") {
            // console.log(this.getcustomerDetails.aadharNumber);
            this.invalidAadhaar = false;
            this.aadharVisible = true;
            this.aadharGetting = true;
            this.customerDetailsForm.get('aadharNumber').enable();
            if (this.getcustomerDetails.aadharNumber.length === 4) {
              const data = "XXXX-XXXX-" + this.getcustomerDetails.aadharNumber
              this.customerDetailsForm.patchValue({
                aadharNumber: data
              });
              this.fetchedAadhaar(data);
            }
            else {
              this.customerDetailsForm.patchValue({
                aadharNumber: this.getcustomerDetails.aadharNumber
              });
              this.fetchedAadhaar(this.getcustomerDetails.aadharNumber);
              // console.log(this.getcustomerDetails.aadharNumber);
            }
            this.aadharVisibleHide = true;
          }
          else if (this.borrowerDetails.accountHolder == "Yes" && this.getcustomerDetails.aadharNumber !== null) { // temp disbale
            // else if (this.borrowerDetails.accountHolder == "Yes") {

            this.aadharVisible = true;
            this.aadharGetting = false;
            this.invalidAadhaar = false;
            this.customerDetailsForm.get('aadharNumber').enable();
            if (this.getcustomerDetails.aadharNumber && this.getcustomerDetails.aadharNumber.length === 4) {
              const data = "XXXX-XXXX-" + this.getcustomerDetails.aadharNumber
              this.customerDetailsForm.patchValue({
                aadharNumber: data
              });
              this.fetchedAadhaar(data);
            }
            else {
              this.customerDetailsForm.patchValue({
                aadharNumber: this.getcustomerDetails.aadharNumber
              });
              this.fetchedAadhaar(this.getcustomerDetails.aadharNumber);
            }
            this.aadharVisibleHide = true;

          }
          else {
            this.aadharVisible = true;
            // this.customerDetailsForm.get('aadharNumber').disable();
            this.aadharVisibleHide = false;
          }
        });


        if (this.getcustomerDetails.panNo) {
          this.panVerify(this.getcustomerDetails.panNo)
        }
        if (this.getcustomerDetails.permanentAddress) {
          if (this.getcustomerDetails.permanentAddress.pincode) {
            this.getCitiesByPincodeOne(this.getcustomerDetails.permanentAddress.pincode);
          }
          if (this.getcustomerDetails.permanentAddress.address1 && this.getcustomerDetails.permanentAddress.address2) {
            this.hasPermanentAddress = true;
          }
          this.customerDetailsForm.patchValue({
            AddressOne: this.getcustomerDetails.permanentAddress.address1 ? this.getcustomerDetails.permanentAddress.address1 : '',
            AddressTwo: this.getcustomerDetails.permanentAddress.address2 ? this.getcustomerDetails.permanentAddress.address2 : '',
            pincode: this.getcustomerDetails.permanentAddress.pincode ? this.getcustomerDetails.permanentAddress.pincode : '',
          });
        }

        if (this.getcustomerDetails.currentAddress) {
          // if (this.getcustomerDetails.currentAddress.pincode) {
          //   this.getBranchDetailsByPincode(this.getcustomerDetails.currentAddress.pincode);
          // }
          this.customerDetailsForm.patchValue({
            AddressOneTwo: this.getcustomerDetails.currentAddress.address1 ? this.getcustomerDetails.currentAddress.address1 : '',
            AddressTwoTwo: this.getcustomerDetails.currentAddress.address2 ? this.getcustomerDetails.currentAddress.address2 : '',
            pincodeTwo: this.getcustomerDetails.currentAddress.pincode ? this.getcustomerDetails.currentAddress.pincode : '',
            cityTwo: this.getcustomerDetails.currentAddress.city ? this.getcustomerDetails.currentAddress.city.toString() : '',
            district1: this.getcustomerDetails.currentAddress.district ? this.getcustomerDetails.currentAddress.district.toString() : '',
            state1: this.getcustomerDetails.currentAddress.state ? this.getcustomerDetails.currentAddress.state.toString() : '',
            country1: this.getcustomerDetails.currentAddress.country ? this.getcustomerDetails.currentAddress.country.toString() : '',
          });

          const pincodeForBranch =
            {
              // pincode: `${this.getcustomerDetails.currentAddress.pincode}, ${this.customerDetailsForm.value.pincode}`,
              applicationId: this.appId,
              pincode: this.getcustomerDetails.currentAddress.pincode.toString(),
            }

          this.genericService.getPreferredBranchDetails(pincodeForBranch, this.token).subscribe(res => {
            this.getBranchDetails = res;

            this.getBranchDetails.forEach(element => {
              if (element.branchId == this.getcustomerDetails.preferredBranch.toString()) {
                this.customerDetailsForm.patchValue({
                  branchName: element.branchId.toString()
                });
                this.onSelectBranch(this.getcustomerDetails.preferredBranch.toString())
              }
            });
          }, err => {
          });
        }
      }, error => {
      });
    }

  }

  getCitiesByPincodeOne(pincode) {
    this.hasName = true;
    const pincodeForCityState = {
      pincode: pincode
    };
    this.genericService.getStateandCityByPincode(pincodeForCityState, this.token).subscribe(result => {
      this.citiesByPincodeOne = result;
      this.customerDetailsForm.patchValue({
        city: this.citiesByPincodeOne.city ? this.citiesByPincodeOne.city.toString() : '',
        district: this.citiesByPincodeOne.district ? this.citiesByPincodeOne.district.toString() : '',
        state: this.citiesByPincodeOne.state ? this.citiesByPincodeOne.state.toString() : '',
        country: this.citiesByPincodeOne.country ? this.citiesByPincodeOne.country.toString() : '',
      });
    });
  }

  getBranchDetailsByPincode(pincode) {
    const prefferedBranch = {
      applicationId: this.appId,
      pincode: pincode,
      // pincode: pincode,
    };
    this.genericService.getPreferredBranchDetails(prefferedBranch, this.token).subscribe(res => {
      this.getBranchDetails = res;
      const branchErr = this.getBranchDetails.statusMessage;
      if (this.getBranchDetails.applicationId === null) {
        this.getBranchDetails = [];
        this.toastr.error('For this Pincode Branch Details are not available', '', { timeOut: 5000 });
      }
      this.customerDetailsForm.get('branchAddress1').reset();
      this.customerDetailsForm.get('branchAddress1').markAsUntouched();
      this.customerDetailsForm.get('branchName').reset();
      this.customerDetailsForm.get('branchName').markAsUntouched();
    });
  }

  sameAddress(event): void {
    if (event.checked === true) {
      this.customerDetailsForm.patchValue({
        AddressOneTwo: this.customerDetailsForm.value.AddressOne,
        AddressTwoTwo: this.customerDetailsForm.value.AddressTwo,
        pincodeTwo: this.customerDetailsForm.value.pincode,
      });

      const pincodeForCityState = {
        pincode: this.customerDetailsForm.value.pincode
      };
      this.genericService.getStateandCityByPincode(pincodeForCityState, this.token).subscribe(result => {
        this.getStateAndCityByPincodeTwo = result;
        if (this.getStateAndCityByPincodeTwo.status === 'Success') {
          this.pincodeErrorTwo = true;
          this.disableField = true;
          this.customerDetailsForm.patchValue({
            cityTwo: this.getStateAndCityByPincodeTwo.city,
            state1: this.getStateAndCityByPincodeTwo.state,
            district1: this.getStateAndCityByPincodeTwo.district,
            country1: this.getStateAndCityByPincodeTwo.country
          });
          this.getBranchDetailsByPincode(this.customerDetailsForm.value.pincode);
        }
      });

      if (this.customerDetailsForm.get('pincode').invalid || this.pincodeError == false) {
        this.pincodeErrorTwo = false;
        this.disableField = false;
      } else {
        this.pincodeErrorTwo = true;
        this.disableField = true;
      }
      this.disableAction = true;
      this.disableField = true;
    } else {
      this.customerDetailsForm.get('AddressOneTwo').reset();
      this.customerDetailsForm.get('district1').reset();
      this.customerDetailsForm.get('pincodeTwo').reset();
      this.customerDetailsForm.get('cityTwo').reset();
      this.customerDetailsForm.get('state1').reset();
      this.customerDetailsForm.get('country1').reset();
      this.customerDetailsForm.get('AddressTwoTwo').reset();
      this.disableAction = false;
      this.disableField = false;
      this.customerDetailsForm.get('branchAddress1').reset();
      this.customerDetailsForm.get('branchName').reset();
      this.getBranchDetails = [];
      this.customerDetailsForm.get('branchName').markAsUntouched();
    }
  }


  residentialStatusChange(id): void {
    this.residentialstatusLkp.forEach(element => {
      if (element.key == id) {
        if (element.value == 'Resident') {
          this.residentInvalid = false;
        } else {
          this.residentInvalid = true;
        }
      }
    });
  }

  onSelectBranch(value): void {
    this.getBranchDetails.forEach(element => {
      if (element.branchId == value) {
        this.branchAddress = element.branchAddr;
      }
    });
    if (value) {
      this.customerDetailsForm.patchValue({
        branchAddress1: this.branchAddress
      });
    }
  }

  keyPressAlphaSpace(event): boolean {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  showSelectValue(val): void {
    if (val === 'Married') {
      for (let i = 0; i < this.maritalStatusLkp.length; i++) {
        if (this.maritalStatusLkp[i].value === 'Married') {
          this.maritalStatusKey = this.maritalStatusLkp[i].key
        }
      }
      this.spouseName = true;
      this.customerDetailsForm.get('spouseName').enable();
    } else {
      for (let i = 0; i < this.maritalStatusLkp.length; i++) {
        if (this.maritalStatusLkp[i].value === 'Unmarried') {
          this.maritalStatusKey = this.maritalStatusLkp[i].key
        }
      }
      this.spouseName = false;
      this.customerDetailsForm.get('spouseName').enable();
    }
  }

  showSelectJobType(val): void {
    if (val === 'Salaried') {
      for (let i = 0; i < this.jobTypeLkp.length; i++) {
        if (this.jobTypeLkp[i].value === 'Salaried') {
          this.jobTypeKey = this.jobTypeLkp[i].key
        }
      }
    } else {
      for (let i = 0; i < this.jobTypeLkp.length; i++) {
        if (this.jobTypeLkp[i].value === 'Non-Salaried') {
          this.jobTypeKey = this.jobTypeLkp[i].key
        }
      }
    }
  }

  back(): void {
    this.route.navigate(['/user-input/loan-details']);
  }

  onSubmit(): void {

    console.log(this.customerDetailsForm.controls)
    if (this.verifyPan == false) {
      this.toastr.error('PAN Number is Invalid', '', { timeOut: 5000 });
    }
    if (this.customerDetailsForm.valid && this.residentInvalid == false && this.invalidAadhaar === false && this.pincodeError !== false && this.pincodeErrorTwo !== false && this.verifyPan == true) {
      this.spinner.show();
      this.service.customerDetails.next(this.customerDetailsForm.value);
      const details = {
        applicationId: parseInt(this.appId),
        appPackageId: parseInt(this.appPackId),
        salutation: parseInt(this.customerDetailsForm.get('prefix').value),
        firstName: this.customerDetailsForm.get('firstName').value,
        middleName: this.customerDetailsForm.get('middleName').value,
        lastName: this.customerDetailsForm.get('lastName').value,
        dateOfbirth:
          _moment(this.customerDetailsForm.value.DOB).format("YYYY-MM-DDTHH:mm:ss.SSS"),
        gender: parseInt(this.customerDetailsForm.get('gender').value),
        mobileNo: this.customerDetailsForm.get('mobile').value,
        aadharNumber: this.aadharGetting ? this.getcustomerDetails.aadharNumber : this.customerDetailsForm.get('aadharNumber').value,
        panNo: this.customerDetailsForm.get('PAN').value.toUpperCase(),
        jobType: this.jobTypeKey,
        email: this.customerDetailsForm.get('email').value,
        category: parseInt(this.customerDetailsForm.get('category').value),
        religion: parseInt(this.customerDetailsForm.get('religion').value),
        residentialStatus: parseInt(this.customerDetailsForm.get('residentialStatus').value),
        maritalStatus: this.maritalStatusKey,
        spouseName: this.customerDetailsForm.get('spouseName').value,
        permanentAddress: {
          address1: this.customerDetailsForm.get('AddressOne').value,
          address2: this.customerDetailsForm.get('AddressTwo').value,
          pincode: parseInt(this.customerDetailsForm.get('pincode').value),
          city: parseInt(this.customerDetailsForm.get('city').value),
          district: parseInt(this.customerDetailsForm.get('district').value),
          state: parseInt(this.customerDetailsForm.get('state').value),
          country: parseInt(this.customerDetailsForm.get('country').value),
        },
        currentAddress: {
          address1: this.customerDetailsForm.get('AddressOneTwo').value,
          address2: this.customerDetailsForm.get('AddressTwoTwo').value,
          pincode: parseInt(this.customerDetailsForm.get('pincodeTwo').value),
          city: parseInt(this.customerDetailsForm.get('cityTwo').value),
          district: parseInt(this.customerDetailsForm.get('district1').value),
          state: parseInt(this.customerDetailsForm.get('state1').value),
          country: parseInt(this.customerDetailsForm.get('country1').value),
        },
        addressAsAbove: this.customerDetailsForm.get('checkBox').value,
        preferredBranch: parseInt(this.customerDetailsForm.get('branchName').value),
        branchAddress: this.customerDetailsForm.get('branchAddress1').value,
        product: 'PL',
      };

      this.genericService.savecustomerDetails(details, this.token).subscribe(result => {
        this.savedetails = result;
        this.spinner.hide();
        if (this.savedetails.entity.dropoffFlag === false) {
          this.applicationId = this.savedetails.entity.applicationId;
          this.appPackageId = this.savedetails.entity.applPackage;
          this.cpId = this.savedetails.entity.cpId;
          localStorage.setItem('applicationId', this.applicationId);
          localStorage.setItem('appPackId', this.appPackageId);
          localStorage.setItem('cpId', this.cpId);

          const screenDetails = { "screenNumber": 5, "screenName": "Customer details", "applicationId": this.applicationId, "product": "PL" }
          this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x });

          if (this.savedetails.entity.isPanMached === "false") {
            this.route.navigate(['/user-input/error'])
          }
          else {
            if (this.customerDetailsForm.value.jobType === 'Non-Salaried') {
              this.route.navigate(['/user-input/business-details']);
            } else if (this.customerDetailsForm.value.jobType === 'Salaried') {
              this.route.navigate(['/user-input/employment-details']);
            }
          }
        } else {
          this.popUpValues = {
            dropoffTempName: this.savedetails.entity.dropoffTempName,
          }
          this.service.dropoffValues.next(this.popUpValues)
          this.dialogRef.open(ResendOtpDialogComponent, { disableClose: true });
        }
      }, error => {
        this.spinner.hide();
      });
      this.service.business.next('BusinessDetails');
      this.service.AddressDetails.next(this.customerDetailsForm.value);

    } else {
      if (this.verifyPan == true) {
        this.toastr.error('Please fill all the details', '', { timeOut: 5000 });
        return;
      }
    }
  }

  // panCardValidator(
  //   control: AbstractControl
  // ): { [key: string]: boolean } | null {
  //   const Fname = control.get('firstName');
  //   const Pan = control.get('PAN');
  //   if (Fname.pristine || Pan.pristine) {
  //     return null;
  //   }
  //   const Fup = control.get('firstName').value.toUpperCase();
  //   const Pup = control.get('PAN').value.toUpperCase();
  //   return Fname && Pan && Fup[0] !== Pup[4] ? { panError: true } : null;
  // }

  // getSavedCustomerDetails() {
  //   this.service.customerDetailsShare.subscribe((x => {
  //     this.fetchCustomerDetails = x;
  //     console.log(this.fetchCustomerDetails);
  //     if (this.fetchCustomerDetails) {
  //       this.customerData();
  //     }
  //   }))
  // }

  // customerData() {
  //   const pincodeForBranch = {
  //     pincode: this.fetchCustomerDetails.pincodeTwo,
  //   }
  //   this.genericService.getPreferredBranchDetails(pincodeForBranch, this.token).subscribe(result => {
  //     this.getBranchDetails = result;
  //     this.customerDetailsForm.patchValue({
  //       branchName: this.fetchCustomerDetails.branchName,
  //       branchAddress1: this.fetchCustomerDetails.branchAddress1,
  //     });
  //   });

  //   this.customerDetailsForm.patchValue({
  //     mobile: this.fetchCustomerDetails.mobile,
  //     prefix: this.fetchCustomerDetails.prefix,
  //     firstName: this.fetchCustomerDetails.firstName,
  //     middleName: this.fetchCustomerDetails.middleName,
  //     lastName: this.fetchCustomerDetails.lastName,
  //     DOB: _moment(this.fetchCustomerDetails.DOB, 'DD-MM-YYYY').toDate(),
  //     aadharNumber: this.fetchCustomerDetails.aadharNumber,

  //     gender: this.fetchCustomerDetails.gender,
  //     PAN: this.fetchCustomerDetails.PAN,
  //     jobType: this.fetchCustomerDetails.jobType,
  //     email: this.fetchCustomerDetails.email,
  //     category: this.fetchCustomerDetails.category,
  //     religion: this.fetchCustomerDetails.religion,
  //     residentialStatus: this.fetchCustomerDetails.residentialStatus,
  //     maritalStatus: this.fetchCustomerDetails.maritalStatus,
  //     AddressOne: this.fetchCustomerDetails.AddressOne,
  //     AddressTwo: this.fetchCustomerDetails.AddressTwo,
  //     pincode: this.fetchCustomerDetails.pincode,
  //     city: this.fetchCustomerDetails.city,
  //     district: this.fetchCustomerDetails.district,
  //     state: this.fetchCustomerDetails.state,
  //     country: this.fetchCustomerDetails.country,
  //     AddressOneTwo: this.fetchCustomerDetails.AddressOneTwo,
  //     AddressTwoTwo: this.fetchCustomerDetails.AddressTwoTwo,
  //     pincodeTwo: this.fetchCustomerDetails.pincodeTwo,
  //     cityTwo: this.fetchCustomerDetails.cityTwo,
  //     district1: this.fetchCustomerDetails.district1,
  //     state1: this.fetchCustomerDetails.state1,
  //     country1: this.fetchCustomerDetails.country1,
  //     checkBox: this.fetchCustomerDetails.checkBox,
  //   })

  //   if (this.fetchCustomerDetails.maritalStatus === 'Married') {
  //     this.customerDetailsForm.get('spouseName').enable();
  //     this.spouseName = true;
  //     this.customerDetailsForm.patchValue({
  //       spouseName: this.fetchCustomerDetails.spouseName,
  //     })
  //   }
  //   else {
  //     this.customerDetailsForm.get('spouseName').disable();
  //     this.spouseName = false;
  //   }
  // }
}
