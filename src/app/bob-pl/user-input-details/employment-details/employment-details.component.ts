import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { ValidatorService } from '../../../shared/validations/validator.service';
import { GenericService } from '../../../shared/services/generic.service';
import { Router } from '@angular/router';
import { merge, Observable, fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material';
import { ResendOtpDialogComponent } from '../../resend-otp-dialog/resend-otp-dialog.component';
import { startWith, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-employment-details',
  templateUrl: './employment-details.component.html',
  styleUrls: ['./employment-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EmploymentDetailsComponent implements OnInit {

  errorForEmployer: boolean;
  employerValue: any;

  filteredOptionsForEmployer: Observable<any>;
  getEmployer: any = [];
  popUpValues: { dropoffTempName: any; };
  saveCustomerScreenDetails: Object;
  employmentForm: FormGroup;
  TermsAndConditionsForm: FormGroup;
  submitted = false;
  changeText: boolean;
  netSal;
  EmiObligation;
  employerTypeLkp: object;
  employmentStatusLkp: any;
  stateLkp: object;
  cityLkp: object;
  token: any;
  pincodeLookup: any;
  getStateAndCityByPincode: any;
  filteredOptions: any;
  applicationId: any;
  employee: any;
  EmployeeDetails: any;
  appPack: any;
  pincodeErr: boolean;
  valid = true;
  salValue: any;
  emiValue: any;
  isValid: boolean = true;
  fetchEmployeeDetails: any;
  monthlyIncome: any;
  error: boolean;
  validCheckBox: boolean;
  fetchId: any = null;
  employementStatusInvalid: boolean = false;
  disable = true;
  emailIDverfication: any;
  disableAction = true;
  checkValue: any;
  validEmi = false;
  emailDialogRef: any;
  dialogReport: boolean = false;
  emailStatus: any;
  index = 1;
  getEmployerList: any = [];

  @ViewChild('autoDetailTwo', { static: false }) statesAutocompleteRef: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger, { static: false }) autocompleteTrigger: MatAutocompleteTrigger;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private validator: ValidatorService,
    private service: ComponentInteractionService,
    private genericService: GenericService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private dialogRef: MatDialog,

  ) { }

  ngOnInit(): void {
    this.empDetailsForm();
    this.checkBoxForm();
    this.changeText = false;
    this.getToken();
    this.getLookUpValues();
    this.getEmployeeDetails();
    this.resetCheckBox();
    this.getCheckBox();
  }

  get f() {
    return this.employmentForm.controls;
  }

  autocompleteScroll() {
    setTimeout(() => {
      if (
        this.statesAutocompleteRef &&
        this.autocompleteTrigger &&
        this.statesAutocompleteRef.panel
      ) {
        fromEvent(this.statesAutocompleteRef.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.statesAutocompleteRef.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.statesAutocompleteRef.panel.nativeElement
              .scrollTop;
            const scrollHeight = this.statesAutocompleteRef.panel.nativeElement
              .scrollHeight;
            const elementHeight = this.statesAutocompleteRef.panel.nativeElement
              .clientHeight;
            const atBottom = scrollHeight === scrollTop + elementHeight;
            if (atBottom) {
              this.index = this.index + 1;
              this.getEmployers(this.employerValue, this.index);
              this.getEmployerList.push(...this.getEmployer.employeeSearchList)
            }
          });
      }
    });
  }

  empDetailsForm(): void {
    this.employmentForm = this.fb.group({
      type: this.validator.valid.prefix,
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(`^[a-zA-Z.' ]*$`),
          Validators.minLength(3),
          Validators.maxLength(75),
        ],
      ],
      workAddress1: this.validator.valid.address,
      workAddress2: this.validator.valid.address,
      pincode: this.validator.valid.pincode,
      city: this.validator.valid.prefix,
      state: this.validator.valid.prefix,
      ofcEmailId: [
        '',
        [Validators.pattern(/^([\w-.]+@(?!gmail\.com)(?!yahoomail\.com)(?!hotmail\.com)(?!ymail\.com)([\w-]+.)+[\w-]{2,4})?$/)],
      ],
      status: this.validator.valid.prefix,
      netSalery: this.validator.valid.salery,
      obligation: this.validator.valid.obligation,
    });
  }

  checkBoxForm(): void {
    this.TermsAndConditionsForm = this.fb.group({
      checkBoxOne: this.validator.valid.checkBox,
      checkBoxTwo: this.validator.valid.checkBox,
      checkBoxThree: this.validator.valid.checkBox,
      checkBoxFour: this.validator.valid.checkBox,
      PepsOptions: ['no']
    })
  }

  resetCheckBox(): void {
    const mergeValues = merge(
      this.employmentForm.get('type').valueChanges,
      this.employmentForm.get('name').valueChanges,
      this.employmentForm.get('workAddress1').valueChanges,
      this.employmentForm.get('workAddress2').valueChanges,
      this.employmentForm.get('pincode').valueChanges,
      this.employmentForm.get('city').valueChanges,
      this.employmentForm.get('state').valueChanges,
      this.employmentForm.get('ofcEmailId').valueChanges,
      this.employmentForm.get('status').valueChanges,
      this.employmentForm.get('netSalery').valueChanges,
      this.employmentForm.get('obligation').valueChanges
    );
    mergeValues.subscribe(() => {
      this.TermsAndConditionsForm.get('checkBoxOne').reset();
      this.TermsAndConditionsForm.get('checkBoxTwo').reset();
      this.TermsAndConditionsForm.get('checkBoxThree').reset();
      this.TermsAndConditionsForm.get('checkBoxFour').reset();

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
    if (this.TermsAndConditionsForm.invalid) {
      this.validCheckBox = false;
    }
    else {
      this.validCheckBox = true;
    }
  }

  allowNumbersOnly(val): boolean {
    const inp = String.fromCharCode(val.keyCode);
    if (/[0-9]/.test(inp)) {
      this.isValid = true;
      return true;
    } else {
      val.preventDefault();
      return false;
    }
    this.isValid = false;
  }

  getToken(): void {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
    this.appPack = localStorage.getItem('appPack');
  }

  getLookUpValues(): void {
    const employerType = {
      lookupName: 'EMPLOYER TYPE'
    };
    this.genericService.getLookUpValues(employerType, this.token).subscribe(result => {
      this.employerTypeLkp = result;
    });

    const employeeStatus = {
      lookupName: 'EMPLOYMENT STATUS'
    };
    this.genericService.getLookUpValues(employeeStatus, this.token).subscribe(result => {
      this.employmentStatusLkp = result;
    });

    const city = {
      lookupName: 'CITY LOOKUP'
    };
    this.genericService.getLookUpValues(city, this.token).subscribe(result => {
      this.cityLkp = result;
    });
    const state = {
      lookupName: 'STATE LOOKUP'
    };
    this.genericService.getLookUpValues(state, this.token).subscribe(result => {
      this.stateLkp = result;
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
          this.disableAction = false;
          this.employmentForm.patchValue({
            city: this.getStateAndCityByPincode.city,
            state: this.getStateAndCityByPincode.state,
          });
        } else {
          this.pincodeErr = false;
          this.disableAction = true;
          this.employmentForm.patchValue({
            city: '',
            state: '',
          });
        }
      }, error => {
        this.spinner.hide();

      });
    } else {
      this.pincodeErr = false;
      this.disableAction = true;
      this.employmentForm.patchValue({
        city: '',
        state: '',
      });
    }
  }



  verifyMail(event): void {
    if (event) {
      this.isValid = true;
    } else {
      this.isValid = false
    }
  }

  emailApi(): void {
    if (this.employmentForm.get('ofcEmailId').hasError('pattern') === false
      && this.employmentForm.get('ofcEmailId').value != null
      && this.employmentForm.get('ofcEmailId').value != '') {
      const data =
        {
          email: this.employmentForm.get('ofcEmailId').value,
          applicationId: this.applicationId
        };
      this.genericService.getEmailVerification(data, this.token).subscribe(x => this.emailIDverfication = x)
    }
  }

  salary(): void {
    // this.employmentForm.get('netSalery').valueChanges.subscribe(res => {
    //   const value = res;
    //   if (value !== '') {
    //     this.salValue = +value.split(',').join('');
    //   }
    //   if (this.employmentForm.get('obligation').value.split('').slice(0, 1)[0] !== '0') {
    //     this.validEmi = false;
    //     this.error = false;
    //     if (this.salValue <= this.emiValue) {
    //       this.error = true;
    //     } else {
    //       this.error = false;
    //     }
    //   } else {
    //     if (this.employmentForm.value.obligation.length === 1 && this.employmentForm.get('obligation').value.split('').slice(0, 1)[0] === '0') {
    //       this.validEmi = false;
    //     } else if (this.employmentForm.value.obligation.length > 1 && this.employmentForm.get('obligation').value.split('').slice(0, 1)[0] === '0') {
    //       this.validEmi = true;
    //     }
    //   }
    // });

    this.salValue = +this.employmentForm.value.netSalery.split(',').join('');
    this.emiValue = +this.employmentForm.value.obligation.split(',').join('');

    if (this.employmentForm.value.obligation !== '') {
      if (this.employmentForm.get('obligation').value.split('').slice(0, 1)[0] !== '0') {
        this.validEmi = false;
        // this.error = false;
        // if (this.salValue <= this.emiValue) {
        //   this.error = true;
        // }
      } else if (this.employmentForm.value.obligation.length === 1 &&
        this.employmentForm.get('obligation').value.split('').slice(0, 1)[0] === '0') {
        this.validEmi = false;
      } else if (this.employmentForm.value.obligation.length > 1 &&
        this.employmentForm.get('obligation').value.split('').slice(0, 1)[0] === '0') {
        this.validEmi = true;
      }
    }
  }

  // employementStatusChange(id): void {
  //   this.employmentStatusLkp.forEach(element => {
  //     if (element.key == id) {
  //       if (element.value == 'Contractual') {
  //         this.employementStatusInvalid = true;
  //       }
  //       else {
  //         this.employementStatusInvalid = false;
  //       }
  //     }
  //   });
  // }

  getEmployeeDetails(): void {
    const emp = {
      applicationId: this.applicationId
    };
    this.genericService.getEmploymentDetails(emp, this.token).subscribe(res => {
      this.EmployeeDetails = res;
      this.getFetchedEmployeeDetails();
    });
  }

  getCheckBox(): void {
    this.service.termsCheckBoxShare.subscribe((value) => {
      this.checkValue = value;
      this.fetchCheckBox();
    });
  }

  fetchCheckBox() {
    this.employmentForm.patchValue({
      checkBox: this.checkValue
    })
  }

  getFetchedEmployeeDetails(): void {
    if (this.EmployeeDetails.empType) {
      this.employmentForm.patchValue({
        type: this.EmployeeDetails.empType.toString(),
        name: this.EmployeeDetails.empName,
        workAddress1: this.EmployeeDetails.workAdrressline1,
        workAddress2: this.EmployeeDetails.workAdrressline2,
        pincode: this.EmployeeDetails.pincode,
        ofcEmailId: this.EmployeeDetails.email,
        status: this.EmployeeDetails.empStatus.toString(),
        netSalery: this.EmployeeDetails.monthlySalary !== null ? this.EmployeeDetails.monthlySalary.toString() : '',
        obligation: this.EmployeeDetails.emiObligation !== null ? this.EmployeeDetails.emiObligation.toString() : '',
      });

      if (this.EmployeeDetails.pincode !== null) {
        this.disableAction = false;
        const pincodeForCityState = {
          pincode: this.EmployeeDetails.pincode
        };
        this.genericService.getStateandCityByPincode(pincodeForCityState, this.token).subscribe((result) => {
          this.getStateAndCityByPincode = result;
          this.pincodeErr = true;
          this.employmentForm.patchValue({
            city: this.getStateAndCityByPincode.city.toString(),
            state: this.getStateAndCityByPincode.state.toString(),
          });
        })
      } else {
        this.disableAction = true;
      }
    }
  }

  saveEmployeeDetails(): void {
    if (this.employmentForm.get('ofcEmailId').hasError('pattern') === false
      && this.employmentForm.get('ofcEmailId').value != null
      && this.employmentForm.get('ofcEmailId').value != ''
      && this.employmentForm.get('ofcEmailId').touched
    ) {
      const payload = {
        applicationId: this.applicationId
      }
      this.spinner.show();
      this.genericService.emailVerificationStatus(payload, this.token).subscribe((res) => {
        this.spinner.hide();
        this.emailStatus = res;

        if (this.emailStatus.status === null || this.emailStatus.status === false) {
          this.emailDialogRef = this.dialog.open(EmailDialogComponent, {
            disableClose: true,
          });
          this.emailDialogRef.afterClosed().subscribe(result => {
            this.dialogReport = result; // => boolean
            if (this.dialogReport === true) {
              this.saveAndNext();
            } else {
              return;
            }
          });

        } else {
          this.saveAndNext();
        }
      }, err => {
        this.spinner.hide();
      });
    } else {
      this.saveAndNext();
    }
  }

  saveAndNext(): void {
    this.salary();
    const emp = {
      applicationId: parseInt(this.applicationId),
      employeeType: parseInt(this.employmentForm.value.type),
      empName: this.employmentForm.value.name,
      adderessLine1: this.employmentForm.value.workAddress1,
      adderessLine2: this.employmentForm.value.workAddress2,
      pincode: parseInt(this.employmentForm.value.pincode),
      state: parseInt(this.getStateAndCityByPincode.state),
      city: parseInt(this.getStateAndCityByPincode.city),
      email: this.employmentForm.value.ofcEmailId,
      empstatus: parseInt(this.employmentForm.value.status),
      netsalary: this.salValue,
      emiObligation: this.emiValue,
      declareCheckBox: this.TermsAndConditionsForm.value.checkBoxOne,
      undertakeCheckBox: this.TermsAndConditionsForm.value.checkBoxTwo,
      agreeCheckBox: this.TermsAndConditionsForm.value.checkBoxThree,
      tncCheckBox: this.TermsAndConditionsForm.value.checkBoxFour,
      PepsChekcBox: this.TermsAndConditionsForm.value.PepsOptions,
      product: 'PL',
    };
    this.spinner.show();
    this.genericService.saveEmploymentDetails(emp, this.token).subscribe((res) => {
      this.spinner.hide();
      const screenDetails = { "screenNumber": 6, "screenName": "Employment details", "applicationId": this.applicationId, "product": "PL" }
      this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
      this.employee = res;
      if (this.employee.fraudId === null || this.employee.fraudId === 1) {
        if (this.employee.dropoffFlag === false) {
          this.route.navigate(['/offers-for-you']);
        } else {
          this.popUpValues = {
            dropoffTempName: this.employee.dropoffTempName,
          }
          this.service.dropoffValues.next(this.popUpValues)
          this.dialogRef.open(ResendOtpDialogComponent, { disableClose: true });

        }
      }
      else {
        this.route.navigate(['/offer-reject'])
      }


    }, err => {
      this.spinner.hide();
    });
  }

  goBack(): void {
    this.route.navigate(['/user-input/customer-details']);
  }

  validationLookup(): void {
    if (this.employmentForm.get('type').value === '0') {
      this.employmentForm.get('type').reset();
    }
    if (this.employmentForm.get('status').value === '0') {
      this.employmentForm.get('status').reset();
    }
  }

  nameOfEmployee(val) {
    this.getEmployerList = [];
    this.employerValue = val;
    this.index = 1;
    this.getEmployers(val, this.index);


  }
  getEmployers(val, index) {
    if (val.length >= 3) {
      const data = {
        name: val,
        pageNumber: this.index,
      }
      this.genericService.getNameofEmployeer(data, this.token).subscribe(x => {
        this.getEmployer = x;
        this.getEmployerList = this.getEmployer.employeeSearchList;
        this.employerNameError(data.name);
      }, err => {
      });
    }
  }

  employerNameError(val) {
    this.errorForEmployer = true;
    this.detailsOfEmployer();
    this.getEmployerList.forEach(element => {
      if (element.value == val) {
        this.errorForEmployer = false;
      }
      return;
    });
  }

  detailsOFEmployer(val): void {
    this.errorForEmployer = true;
    this.getEmployerList.forEach(element => {
      if (element.value == val) {
        this.errorForEmployer = false;
      }
      return;
    });
  }

  detailsOfEmployer(): void {
    this.filteredOptionsForEmployer = this.employmentForm.get('name').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(value => value ? this.filterPartner(value) : this.getEmployerList.slice())
      );
  }

  private filterPartner(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.getEmployerList.filter(option => option.value.toLowerCase().includes(filterValue));
  }

  onSubmit(): void {
    this.checkBoxValidation();
    this.validationLookup();
    this.salary();
    console.log(this.employmentForm.controls)
    if (this.employmentForm.valid && this.TermsAndConditionsForm.valid &&
      this.validEmi === false &&
      this.pincodeErr === true) {
      this.isValid = true;
      this.saveEmployeeDetails();
      this.submitted = true;
      this.service.termsCheckbox.next(this.employmentForm.value.checkBox);
    }
    else {
      this.isValid = false;
      this.toastr.error('Please fill all the details', '', { timeOut: 5000 });
    }
  }
}

@Component({
  selector: 'app-email-dialog',
  templateUrl: 'email-dialog.html',
})
export class EmailDialogComponent implements OnInit {
  ngOnInit() {

  }

  constructor(public dialogRef: MatDialogRef<EmailDialogComponent>) { }
}
