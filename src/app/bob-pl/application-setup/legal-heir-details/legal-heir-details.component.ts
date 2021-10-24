import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { ValidatorService } from '../../../shared/validations/validator.service';
import { GenericService } from 'src/app/shared/services/generic.service';
import { Observable, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-legal-heir-details',
  templateUrl: './legal-heir-details.component.html',
  styleUrls: ['./legal-heir-details.component.scss'],
})
export class LegalHeirDetailsComponent implements OnInit {
  saveCustomerScreenDetails: Object;
  Address: any;
  legalHeirForm: FormGroup;
  fatcaDetailsForm: FormGroup;
  arr: FormArray;
  token;
  state;
  city;
  country;
  community;
  pincode;
  category;
  relation;
  salutation;
  maritalStatus;
  occupation;
  addressforTax;
  addressType;
  pincodeLookup: any;
  getPincodeByStateandCity: any;
  filteredOptions: Observable<any[]>;
  countryLkp: any;
  nationalityLkp: any;
  disableAction = false;
  pincodeErr: boolean;
  selectPincodeErr: boolean;
  pincodeValue;
  district: object;
  isPincode: boolean;
  nationality: any;
  saveLegalDetails: any;
  applicationID: string;
  appID: string;
  basicDetails: any = [];
  deleteBtn: boolean = false;
  getLegalAppID: any;
  fetchLegalDetails: any;
  customerAge: boolean;
  invalidAge: boolean;
  validCheckBox: boolean;
  validCheckBoxTwo: boolean;
  sameaddressType: any;
  addressKey: any = null;
  currentAddress: { address1: any; address2: any; city: number; district: number; state: number; country: number; pincode: number; };
  customerAddress: any;
  disableField: boolean;
  filteredOptionsDetailActivity: Observable<any[]>;
  cityError: boolean = false;
  cityKey: any;
  cityValue: any;
  index: number;
  customerDetails: any;
  communicationKey: any = null;
  currentAddressDetails: any;

  constructor(private fb: FormBuilder,
    private componentInteractionService: ComponentInteractionService,
    public validator: ValidatorService,
    private genericService: GenericService,
    private spinner: NgxSpinnerService,
    private route: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.form();
    this.AddressDetails();
    this.fatcaForm();
    this.serviceGenerate();
  }

  fatcaForm(): void {
    this.fatcaDetailsForm = this.fb.group({
      fatcaCountry: this.validator.valid.nation,
      fatcaCity: this.validator.valid.nation,
      fatcaNationality: this.validator.valid.nation,
      // fatcaFatherName: this.validator.valid.firstName,
      // fatcaMotherName: this.validator.valid.firstName,
      // fatcaResidenceAddress: this.validator.valid.nation,
      // fatcaAddressType: this.validator.valid.nation,
      residenceCheckBox: this.validator.valid.checkBox,
      declarationCheckBox: this.validator.valid.checkBox,
    });
  }

  form(): void {
    this.legalHeirForm = this.fb.group({
      arr: this.fb.array([this.createItem()]),
    });
  }

  resetCheckBox(): void {
    const mergeValues = merge(
      this.fatcaDetailsForm.get('fatcaCountry').valueChanges,
      this.fatcaDetailsForm.get('fatcaCity').valueChanges,
      this.fatcaDetailsForm.get('fatcaNationality').valueChanges,
      this.fatcaDetailsForm.get('fatcaFatherName').valueChanges,
      this.fatcaDetailsForm.get('fatcaMotherName').valueChanges,
      this.fatcaDetailsForm.get('fatcaResidenceAddress').valueChanges,
      this.fatcaDetailsForm.get('fatcaAddressType').valueChanges
    );
    mergeValues.subscribe(() => {
      this.fatcaDetailsForm.get('residenceCheckBox').reset();
      this.fatcaDetailsForm.get('declarationCheckBox').reset();
    });
    this.arrControl.map((val, i) => {
      const mergeValues = merge(
        this.arrControl[i].get('salutation').valueChanges,
        this.arrControl[i].get('firstName').valueChanges,
        this.arrControl[i].get('middleName').valueChanges,
        this.arrControl[i].get('lastName').valueChanges,
        this.arrControl[i].get('relation').valueChanges,
        this.arrControl[i].get('age').valueChanges,
        this.arrControl[i].get('occupation').valueChanges,
        this.arrControl[i].get('addressLine1').valueChanges,
        this.arrControl[i].get('addressLine2').valueChanges,
        this.arrControl[i].get('pincode').valueChanges,
        this.arrControl[i].get('district').valueChanges,
        this.arrControl[i].get('city').valueChanges,
        this.arrControl[i].get('state').valueChanges,
        this.arrControl[i].get('country').valueChanges,
        this.arrControl[i].get('checkbox').valueChanges,
      );
      mergeValues.subscribe(() => {
        this.fatcaDetailsForm.get('residenceCheckBox').reset();
        this.fatcaDetailsForm.get('declarationCheckBox').reset();
      })
    });
  }

  onCheck(event): void {
    if (event.checked === true) {
      this.validCheckBox = true;

    } else {
      this.validCheckBox = false;
    }
  }

  onCheckEvent(event): void {
    if (event.checked === true) {
      this.validCheckBoxTwo = true;
    } else {
      this.validCheckBoxTwo = false;
    }
  }

  checkBoxValidation(): void {
    this.fatcaDetailsForm.get('residenceCheckBox').invalid ? this.validCheckBox = false : this.validCheckBox = true;
    this.fatcaDetailsForm.get('declarationCheckBox').invalid ? this.validCheckBoxTwo = false : this.validCheckBoxTwo = true;
  }

  createItem(): any {
    return this.fb.group({
      id:null,
      salutation: this.validator.valid.nation,
      firstName: this.validator.valid.firstName,
      middleName: this.validator.valid.middleName,
      lastName: this.validator.valid.lastName,
      relation: this.validator.valid.nation,
      age: this.validator.valid.age,
      occupation: this.validator.valid.nation,
      addressLine1: this.validator.customerDetails.AddressOne,
      addressLine2: this.validator.customerDetails.AddressOne,
      pincode: ['', [Validators.required]],
      district: this.validator.valid.prefix,
      city: this.validator.valid.prefix,
      state: this.validator.valid.prefix,
      country: this.validator.valid.prefix,
      checkbox: false,
      checkboxCorrespondenceAddress: false
    });
  }

  resetAge(i): void {
    this.arrControl[i].get('age').reset();
    this.arrControl[i].get('age').markAsUntouched();
  }

  addItem(): void {
    this.arr = this.legalHeirForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
    if (this.arr.length >= 2) {
      this.deleteBtn = true;
    }
  }

  serviceGenerate(): void {
    this.token = localStorage.getItem('token');
    this.applicationID = localStorage.getItem('applicationId');
    this.appID = localStorage.getItem('AID');
    this.getLegalHeir();
   
    
  }

  getCustomerData() {
    const customerDetails = {
      applicationId: this.applicationID
    };
    this.spinner.show();
    this.genericService.getCustomerStatus(customerDetails, this.token).subscribe(result => {
      this.spinner.hide();
      this.customerDetails = result;
    }, error => {
      this.spinner.hide();
    });
  }

  getLegalHeir(): void {
    this.spinner.show();
    const salutation = {
      lookupName: 'SALUTATION'
    };
    this.genericService.getLookUpValues(salutation, this.token).subscribe(result => {
      this.salutation = result;
     
    }, error => {
      this.spinner.hide();
    });

    const relation = {
      lookupName: 'RELATION'
    };
    
    this.genericService.getLookUpValues(relation, this.token).subscribe(result => {
      this.relation = result;

    }, error => {
      this.spinner.hide();
    });

    const occupation = {
      lookupName: 'PROFESSION OR OCCUPATION TYPE'
    };
 
    this.genericService.getLookUpValues(occupation, this.token).subscribe(result => {
      this.occupation = result;
     
    }, error => {
      this.spinner.hide();
    });

    const state = {
      lookupName: 'STATE LOOKUP'
    };
  
    this.genericService.getLookUpValues(state, this.token).subscribe(result => {
      this.state = result;
 
    }, error => {
      this.spinner.hide();
    });

    const country = {
      lookupName: 'COUNTRY LOOKUP'
    };

    this.genericService.getLookUpValues(country, this.token).subscribe(result => {
      this.country = result;
      this.selectCountry();
     
    }, error => {
      this.spinner.hide();
    });

    const city = {
      lookupName: 'CITY LOOKUP'
    };
 
    this.genericService.getLookUpValues(city, this.token).subscribe(result => {
      this.city = result;
      this.getLegalHeirDetails()
      this.cityFilter();
      this.getCustomerData();
     
    }, error => {
      this.spinner.hide();
    });

    const district = {
      lookupName: 'DISTRICT'
    };
 
    this.genericService.getLookUpValues(district, this.token).subscribe(result => {
      this.district = result;
    
    }, error => {
      this.spinner.hide();
    });

    const addressTax = {
      lookupName: 'ADDRESS FOR TAX PURPOSES'
    };
    
    this.genericService.getLookUpValues(addressTax, this.token).subscribe(result => {
      this.addressforTax = result;
    
    }, error => {
      this.spinner.hide();
    });

    const addressType = {
      lookupName: 'LEGAL ADDRESS TYPE'
    };
    
    this.genericService.getLookUpValues(addressType, this.token).subscribe(result => {
      this.addressType = result;
    
    }, error => {
      this.spinner.hide();
    });

    const sameaddressType = {
      lookupName: 'ADDRESS TYPE'
    };
  
    this.genericService.getLookUpValues(sameaddressType, this.token).subscribe(result => {
      this.sameaddressType = result;
     
      this.sameaddressType.forEach(element => {
        if (element.value == 'PERMANENT ADDRESS') {
          this.addressKey = element.key

        }

        if(element.value == 'CURRENT ADDRESS')
        {
          this.communicationKey = element.key
        }
      });
    }, error => {
      this.spinner.hide();
    });

    // const pincode = {
    //   lookupName: 'PINCODE'
    // };
    // this.genericService.getLookUpValues(pincode, this.token).subscribe(result => {
    //   this.pincodeLookup = result;
    // }, error => {
    // });

    const nationalityLookup = {
      lookupName: 'NATIONALITY'
    };
    
    this.genericService.getLookUpValues(nationalityLookup, this.token).subscribe(result => {
      this.nationality = result;
      this.selectNationality();
    }, error => {
      this.spinner.hide();
    });

  }

  // age(val, i) {
  //   const controls = "controls";
  //   this.componentInteractionService.customerAgeShare.subscribe((res: any) => {
  //     this.customerAge = res;
  //     // console.log(this.customerAge);
  //     if (this.legalHeirForm.get('arr')[controls][i].value.relation == 2122 ||
  //       this.legalHeirForm.get('arr')[controls][i].value.relation == 2121
  //   ) {
  //       if (this.customerAge >= val || val > 70 || val <= 40) {
  //         this.invalidAge = true;
  //       }
  //       else {
  //         this.invalidAge = false ;
  //       }
  //     }
  //     if (this.legalHeirForm.get('arr')[controls][i].value.relation == 2125 ||
  //       this.legalHeirForm.get('arr')[controls][i].value.relation == 2124
  //   ) {
  //       if (this.customerAge <= val || val < 18) {
  //         this.invalidAge = true;
  //       }
  //       else {
  //         this.invalidAge = false ;
  //       }
  //     }
  //     if (this.legalHeirForm.get('arr')[controls][i].value.relation == 2123
  //   ) {
  //       if (val > 70 || val < 18) {
  //         this.invalidAge = true;
  //       }
  //       else {
  //         this.invalidAge = false ;
  //       }
  //     }
  //   });
  // }

  getLegalHeirDetails(): void {
    const payload =
    {
      "applicationId": this.applicationID
    }
    this.spinner.show();
    this.genericService.getLegalHeirDetails(payload, this.token).subscribe(x => {
   
      this.fetchLegalDetails = x;
      if (this.fetchLegalDetails.message != 'Legal Hair Details not available ') {

        const applicationID =
        {
          "applicationId": this.applicationID,
          "addressType": this.addressKey
        }
      
        this.genericService.getsameAddressDetails(applicationID, this.token).subscribe(x => {
          this.spinner.hide();
          this.customerAddress = x;
        })

        if (this.fetchLegalDetails.cityOfBirth != null) {
          this.city.forEach(element => {
            if (element.key == this.fetchLegalDetails.cityOfBirth) {
              this.cityValue = element.value;
              this.fatcaDetailsForm.patchValue({
                // fatcaCountry: this.fetchLegalDetails.countryOfBirth ? this.fetchLegalDetails.countryOfBirth.toString() : '',
                fatcaCity: this.cityValue
              })
            }
            else {
              this.cityValue = '';
            }
          });
        }
        this.fatcaDetailsForm.patchValue({
          // fatcaCountry: this.fetchLegalDetails.countryOfBirth ? this.fetchLegalDetails.countryOfBirth.toString() : '',
          // fatcaCity: this.cityValue ,
          // fatcaNationality: this.fetchLegalDetails.nationality ? this.fetchLegalDetails.nationality.toString() : '',
          fatcaFatherName: this.fetchLegalDetails.fatherName,
          fatcaMotherName: this.fetchLegalDetails.motherName,
          fatcaResidenceAddress: this.fetchLegalDetails.residenceTaxAddress ? this.fetchLegalDetails.residenceTaxAddress.toString() : '',
          fatcaAddressType: this.fetchLegalDetails.addressType ? this.fetchLegalDetails.addressType.toString() : '',
          residenceCheckBox: this.fetchLegalDetails.indianResidency,
          declarationCheckBox: this.fetchLegalDetails.fatcaInformationAcceptance,
        })

        if (this.fetchLegalDetails.basicDetails) {

          for (let i = 0; i < this.fetchLegalDetails.basicDetails.length; i++) {
            const controls = 'controls';
            this.legalHeirForm.get('arr')[controls][i].patchValue({
              id:this.fetchLegalDetails.basicDetails[i].id,
              salutation: this.fetchLegalDetails.basicDetails[i].salutation.toString(),
              firstName: this.fetchLegalDetails.basicDetails[i].firstName,
              middleName: this.fetchLegalDetails.basicDetails[i].middleName,
              lastName: this.fetchLegalDetails.basicDetails[i].lastName,
              relation: this.fetchLegalDetails.basicDetails[i].relation.toString(),
              age: this.fetchLegalDetails.basicDetails[i].age,
              occupation: this.fetchLegalDetails.basicDetails[i].occupation.toString(),
              addressLine1: this.fetchLegalDetails.basicDetails[i].currentAddress.address1,
              addressLine2: this.fetchLegalDetails.basicDetails[i].currentAddress.address2,
              pincode: this.fetchLegalDetails.basicDetails[i].currentAddress.pincode,
              district: this.fetchLegalDetails.basicDetails[i].currentAddress.district.toString(),
              city: this.fetchLegalDetails.basicDetails[i].currentAddress.city.toString(),
              state: this.fetchLegalDetails.basicDetails[i].currentAddress.state.toString(),
              country: this.fetchLegalDetails.basicDetails[i].currentAddress.country.toString(),
              checkbox: this.fetchLegalDetails.basicDetails[i].addressAsApplicant
            }
            );
            this.addItem();
            this.arr.removeAt(this.fetchLegalDetails.basicDetails.length);
            console.log(this.fetchLegalDetails.basicDetails[i].addressAsApplicant);

            if (this.fetchLegalDetails.basicDetails[i].addressAsApplicant === true) {
              this.disableAction = true;
              this.disableField = true;
            } else {
              this.disableAction = false;
              this.disableField = false;
            }
          }


          if (this.fetchLegalDetails.basicDetails.length === 1) {
            this.deleteBtn = false;
          }
        }

      }
      if (!this.fetchLegalDetails.indianResidency && !this.fetchLegalDetails.fatcaInformationAcceptance) {
        this.resetCheckBox();
      }
    }, err => {
      this.spinner.hide();
    })
  }


  deleteItem(position): void {
    this.arr.removeAt(position);
    if (this.arr.length == 1) {
      this.deleteBtn = false;
    }
  }

  AddressDetails(): void {
    this.token = localStorage.getItem('token');
    this.componentInteractionService.AddressDetailsShare.subscribe((result: any) => {
      this.Address = result;
    });
  }

  ApplicantAddress(event, i,currentAddress): void {
    
    const controls = 'controls';
    this.legalHeirForm.get('arr')[controls][i].patchValue({checkboxCorrespondenceAddress : false})
    console.log(currentAddress)
    if (event.checked === true) {
      const applicationID =
      {
        applicationId: this.applicationID,
        addressType: this.addressKey
      }
      this.spinner.show();
      this.genericService.getsameAddressDetails(applicationID, this.token).subscribe(x => {
        this.spinner.hide();
        this.customerAddress = x;
        this.legalHeirForm.get('arr')[controls][i].patchValue({
          addressLine1: this.customerAddress.address1,
          addressLine2: this.customerAddress.address2,
          pincode: this.customerAddress.pincode,
          district: this.customerAddress.district.toString(),
          city: this.customerAddress.city.toString(),
          state: this.customerAddress.state.toString(),
          country: this.customerAddress.country.toString(),
        });
        this.disableAction = true;
        this.disableField = true;

        this.legalHeirForm.get('arr')[controls][i].get('addressLine1').disable();
        this.legalHeirForm.get('arr')[controls][i].get('addressLine2').disable();
        this.legalHeirForm.get('arr')[controls][i].get('pincode').disable();
        this.legalHeirForm.get('arr')[controls][i].get('district').disable();
        this.legalHeirForm.get('arr')[controls][i].get('city').disable();
        this.legalHeirForm.get('arr')[controls][i].get('state').disable();
        this.legalHeirForm.get('arr')[controls][i].get('country').disable();
      })

        , error => {
          this.spinner.hide();
        };
    } else {
      this.legalHeirForm.get('arr')[controls][i].get('addressLine1').reset();
      this.legalHeirForm.get('arr')[controls][i].get('addressLine2').reset();
      this.legalHeirForm.get('arr')[controls][i].get('pincode').reset();
      this.legalHeirForm.get('arr')[controls][i].get('district').reset();
      this.legalHeirForm.get('arr')[controls][i].get('city').reset();
      this.legalHeirForm.get('arr')[controls][i].get('state').reset();
      this.legalHeirForm.get('arr')[controls][i].get('country').reset();

      this.legalHeirForm.get('arr')[controls][i].get('addressLine1').enable();
      this.legalHeirForm.get('arr')[controls][i].get('addressLine2').enable();
      this.legalHeirForm.get('arr')[controls][i].get('pincode').enable();
      this.legalHeirForm.get('arr')[controls][i].get('district').enable();
      this.legalHeirForm.get('arr')[controls][i].get('city').enable();
      this.legalHeirForm.get('arr')[controls][i].get('state').enable();
      this.legalHeirForm.get('arr')[controls][i].get('country').enable();
      this.disableAction = false;
      this.disableField = false;
    }
  }

  ApplicantCorrespondenceAddress(event, i, applicantAddress): void {
    const controls = 'controls';
    this.legalHeirForm.get('arr')[controls][i].patchValue({checkbox : false})
        if (event.checked === true) {
      const applicationID =
      {
        applicationId: this.applicationID,
        addressType: this.communicationKey
      }
      this.spinner.show();
      this.genericService.getsameAddressDetails(applicationID, this.token).subscribe(x => {
        this.spinner.hide();
        this.currentAddressDetails = x;
        this.legalHeirForm.get('arr')[controls][i].patchValue({
          addressLine1: this.currentAddressDetails.address1,
          addressLine2: this.currentAddressDetails.address2,
          pincode: this.currentAddressDetails.pincode,
          district: this.currentAddressDetails.district.toString(),
          city: this.currentAddressDetails.city.toString(),
          state: this.currentAddressDetails.state.toString(),
          country: this.currentAddressDetails.country.toString(),
        });
        this.disableAction = true;
        this.disableField = true;

        this.legalHeirForm.get('arr')[controls][i].get('addressLine1').disable();
        this.legalHeirForm.get('arr')[controls][i].get('addressLine2').disable();
        this.legalHeirForm.get('arr')[controls][i].get('pincode').disable();
        this.legalHeirForm.get('arr')[controls][i].get('district').disable();
        this.legalHeirForm.get('arr')[controls][i].get('city').disable();
        this.legalHeirForm.get('arr')[controls][i].get('state').disable();
        this.legalHeirForm.get('arr')[controls][i].get('country').disable();
      })

        , error => {
          this.spinner.hide();
        };
    } else {
      this.legalHeirForm.get('arr')[controls][i].get('addressLine1').reset();
      this.legalHeirForm.get('arr')[controls][i].get('addressLine2').reset();
      this.legalHeirForm.get('arr')[controls][i].get('pincode').reset();
      this.legalHeirForm.get('arr')[controls][i].get('district').reset();
      this.legalHeirForm.get('arr')[controls][i].get('city').reset();
      this.legalHeirForm.get('arr')[controls][i].get('state').reset();
      this.legalHeirForm.get('arr')[controls][i].get('country').reset();

      this.legalHeirForm.get('arr')[controls][i].get('addressLine1').enable();
      this.legalHeirForm.get('arr')[controls][i].get('addressLine2').enable();
      this.legalHeirForm.get('arr')[controls][i].get('pincode').enable();
      this.legalHeirForm.get('arr')[controls][i].get('district').enable();
      this.legalHeirForm.get('arr')[controls][i].get('city').enable();
      this.legalHeirForm.get('arr')[controls][i].get('state').enable();
      this.legalHeirForm.get('arr')[controls][i].get('country').enable();
      this.disableAction = false;
      this.disableField = false;
    }
  }


  selectCountry(): void {
    this.country.forEach(element => {
      if (element.value === 'India') {
        this.countryLkp = element.key;
        this.fatcaDetailsForm.patchValue({
          fatcaCountry: this.countryLkp.toString(),
        });
      }
    });

  }

  selectNationality(): void {
    this.nationality.forEach(element => {
      if (element.value === 'India') {
        this.nationalityLkp = element.key;
        this.fatcaDetailsForm.patchValue({
          fatcaNationality: this.nationalityLkp.toString()
        });
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

  get arrControl() {
    return (this.legalHeirForm.get('arr') as FormArray).controls;
  }


  cityFilter(): void {
    this.filteredOptionsDetailActivity = this.fatcaDetailsForm.get('fatcaCity').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(value => value ? this.fil(value) : this.city.slice())
      );
  }

  private fil(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.city.filter(option => option.value.toLowerCase().includes(filterValue));
  }

  cityValidation(val) {
    this.cityError = true;
    this.city.forEach(element => {
      if (element.value == val) {
        this.cityError = false;
      }
      return;
    });
  }

  getCityDetails(val) {
    this.cityError = true;
    this.city.forEach(element => {
      if (element.value == val) {
        this.cityError = false;
      }
      return;
    });
  }

  stateAndCityByPincode(val, i): void {
    const controls = 'controls';
    if (val.length === 6) {
      const pincodeForCityState = {
        pincode: val
      };
      this.genericService.getStateandCityByPincode(pincodeForCityState, this.token).subscribe(result => {
        this.getPincodeByStateandCity = result;
        if (this.getPincodeByStateandCity.status === 'Success') {
          this.isPincode = true;
          this.disableField = true;
          this.legalHeirForm.get('arr')[controls][i].patchValue({
            city: this.getPincodeByStateandCity.city,
            state: this.getPincodeByStateandCity.state,
            district: this.getPincodeByStateandCity.district,
            country: this.getPincodeByStateandCity.country
          });
        } else {
          this.isPincode = false;
          this.disableField = false;
          this.legalHeirForm.get('arr')[controls][i].patchValue({
            city: '',
            state: '',
            district: '',
            country: ''
          });
        }
      });
    } else {
      this.isPincode = false;
      this.disableField = false;
      this.legalHeirForm.get('arr')[controls][i].patchValue({
        city: '',
        state: '',
        district: '',
        country: ''
      });
    }
  }

  // goBack() {
  //   this.route.navigate(['/application-setup/basic-tnc']);
  // }

  submit(): void {
    this.checkBoxValidation();
    this.legalHeirForm.markAllAsTouched();
    this.fatcaDetailsForm.markAllAsTouched();

    if (this.legalHeirForm.valid && this.fatcaDetailsForm.valid && this.cityError == false && this.isPincode !== false) {
      const control = this.legalHeirForm.controls.arr as FormArray;
      const controls = 'controls';
    for (let i = 0; i < control.length; i++) {
       
        if (this.legalHeirForm.get('arr')[controls][i].get('checkbox').value == true) {
          this.currentAddress =
          {
            address1: this.customerAddress.address1,
            address2: this.customerAddress.address2,
            city: parseInt(this.customerAddress.city),
            district: parseInt(this.customerAddress.district),
            state: parseInt(this.customerAddress.state),
            country: parseInt(this.customerAddress.country),
            pincode: parseInt(this.customerAddress.pincode),
          }
        }
        else if(this.legalHeirForm.get('arr')[controls][i].get('checkboxCorrespondenceAddress').value == true)
        {
          this.currentAddress =
          {
            address1: this.currentAddressDetails.address1,
            address2: this.currentAddressDetails.address2,
            city: parseInt(this.currentAddressDetails.city),
            district: parseInt(this.currentAddressDetails.district),
            state: parseInt(this.currentAddressDetails.state),
            country: parseInt(this.currentAddressDetails.country),
            pincode: parseInt(this.currentAddressDetails.pincode),
          }
        } else {
          this.currentAddress =
          {
            address1: this.legalHeirForm.get('arr')[controls][i].get('addressLine1').value,
            address2: this.legalHeirForm.get('arr')[controls][i].get('addressLine2').value,
            city: parseInt(this.legalHeirForm.get('arr')[controls][i].get('city').value),
            district: parseInt(this.legalHeirForm.get('arr')[controls][i].get('district').value),
            state: parseInt(this.legalHeirForm.get('arr')[controls][i].get('state').value),
            country: parseInt(this.legalHeirForm.get('arr')[controls][i].get('country').value),
            pincode: parseInt(this.legalHeirForm.get('arr')[controls][i].get('pincode').value),
          }
        }

        for (let k = i; k == i; k++) {
          this.basicDetails.push({
            id:this.legalHeirForm.get('arr')[controls][k].get('id').value,
            salutation: parseInt(this.legalHeirForm.get('arr')[controls][k].get('salutation').value),
            firstName: this.legalHeirForm.get('arr')[controls][k].get('firstName').value,
            middleName: this.legalHeirForm.get('arr')[controls][k].get('middleName').value,
            lastName: this.legalHeirForm.get('arr')[controls][k].get('lastName').value,
            relation: parseInt(this.legalHeirForm.get('arr')[controls][k].get('relation').value),
            occupation: parseInt(this.legalHeirForm.get('arr')[controls][k].get('occupation').value),
            age: parseInt(this.legalHeirForm.get('arr')[controls][k].get('age').value),
            addressAsApplicant: this.legalHeirForm.get('arr')[controls][k].get('checkbox').value,
            addressAsCurrent:this.legalHeirForm.get('arr')[controls][k].get('checkboxCorrespondenceAddress').value,
            currentAddress: this.currentAddress
          })
        }
      }

    

      this.city.forEach(element => {
        if (element.value == this.fatcaDetailsForm.value.fatcaCity) {
          this.cityKey = element.key;
        }
      });

      const data =
      {
        applicationId: this.applicationID,
        basicDetails: this.basicDetails,
        fatherName: this.fatcaDetailsForm.value.fatcaFatherName,
        motherName: this.fatcaDetailsForm.value.fatcaMotherName,
        countryOfBirth: parseInt(this.fatcaDetailsForm.value.fatcaCountry),
        cityOfBirth: parseInt(this.cityKey),
        nationality: parseInt(this.fatcaDetailsForm.value.fatcaNationality),
        residenceTaxAddress: parseInt(this.fatcaDetailsForm.value.fatcaResidenceAddress),
        addressType: parseInt(this.fatcaDetailsForm.value.fatcaAddressType),
        indianResidency: this.fatcaDetailsForm.value.residenceCheckBox,
        fatcaInformationAcceptance: this.fatcaDetailsForm.value.declarationCheckBox,
      };

      this.spinner.show();
      this.genericService.saveLegalHeirDetails(data, this.token).subscribe(x => {
        this.spinner.hide();
        const screenDetails = { "screenNumber": 20, "screenName": "Legal heir", "applicationId": this.applicationID, "product": "PL" }
        this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
        this.saveLegalDetails = x;
        this.componentInteractionService.legalHeir.next(this.saveLegalDetails.applicationId)
      }, err => {
        this.spinner.hide();
      })

      if (this.customerDetails.appliedLoanAmount <= this.customerDetails.preapprovedamt) { //sanctionLoanAmount
        this.route.navigate(['/application-setup/e-contract']);
      } else {
        this.route.navigate(['/application-setup/image-kyc']);
      }
    } else {
      this.toastr.error('Please fill all the details', '', { timeOut: 5000 });
      return;
    }
  }
}
