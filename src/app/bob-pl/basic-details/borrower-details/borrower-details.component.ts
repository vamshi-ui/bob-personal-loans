import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorService } from 'src/app/shared/validations/validator.service';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/shared/services/generic.service';
import { MatDialog } from '@angular/material';
import { ResendOtpDialogComponent } from '../../resend-otp-dialog/resend-otp-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-borrower-details',
  templateUrl: './borrower-details.component.html',
  styleUrls: ['./borrower-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class BorrowerDetailsComponent implements OnInit {
  accountHolder: any;
  panVerifyDetails: any;
  verifyPan: boolean = true;
  public enterOtp: any = false;
  public counter: any = 0;
  public EnteredNumber: number;
  public aadharText: any = false;
  borrowerForm: FormGroup;
  verifyOTP: FormGroup;
  validAadharLength: any;
  valid;
  message = '';
  AccountNumber;
  AadharNumber;
  PanNumber;
  CustIdNumber;
  resend: boolean;
  selectValue: boolean;
  invalidOtp: boolean;
  interval: any;
  firstField = false;
  token;
  borrowerSelectResponse: any;
  borrowerAccountResponse: object;
  customerData: any;
  aadhaarOTP;
  appId: string;
  resendAadharOTP: any;
  appPack: string;
  borrowerVerifyDetails: any;
  borrowerOTPDetails: any;
  mobilenumber: any = null;
  payload: any;
  submitPayload: any;
  invalidAadhaar: boolean;
  btnCounter = 0;
  validcustIdLength: boolean = false;
  validCheckBox: boolean;
  cpId: string;
  invalidAccNum: boolean;
  invalidCustId: boolean;
  saveCustomerScreenDetails: Object;
  hideOtp = true;
  preapprovedamt: any;
  accountNumberInvalid: boolean = false;
  tmsData: Object;
  dialogRefClose: any;
  custIds: any;
  CustomerIds = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: ComponentInteractionService,
    public validator: ValidatorService,
    public route: Router,
    public genericService: GenericService,
    private dialogRef: MatDialog,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;

  ngOnInit(): void {
    this.borrowerDetailsForm();
    this.countDown();
    this.getToken();
    this.getSelectValueLkp();
    this.getAccoutHolderLkp();
    this.mobileNumber();
  }

  borrowerDetailsForm(): void {
    this.borrowerForm = this.formBuilder.group({
      accountHolder: this.validator.valid.prefix,
      selectvalue: this.validator.valid.prefix,
      accountNumber: this.validator.borrowerDetails.AccountNumber,
      aadharNumber: this.validator.borrowerDetails.AadhaarNumber,
      panNumber: this.validator.customerDetails.PAN,
      custId: this.validator.borrowerDetails.customerId,
      customerIds: this.validator.valid.prefix,
      otp: this.validator.borrowerDetails.accountHolder,
      checkBox: this.validator.borrowerDetails.checkBox,
    });
  }

  getToken(): void {
    this.token = localStorage.getItem('token');
  }

  mobileNumber(): void {
    this.service.mobileNoShare.subscribe(x => {
      this.mobilenumber = x;
      if (this.mobilenumber == '') {
        this.route.navigate(['/']);
      }
    });
  }

  onCheck(event): void {
    if (event.checked === true) {
      this.validCheckBox = true;
    } else {
      this.validCheckBox = false;
    }
  }

  getAccoutHolderLkp(): void {
    const payload = {
      lookupName: 'OPTIONS YES NO'
    };
    this.genericService.getLookUpValues(payload, this.token).subscribe(result => {
      this.borrowerAccountResponse = result;
    });
  }

  getSelectValueLkp(): void {
    const payload = {
      lookupName: 'ETB_IDENTIFIER'
    };
    this.genericService.getLookUpValues(payload, this.token).subscribe(result => {
      this.borrowerSelectResponse = result;
    });
  }

  alignAadhar(): void {
    this.borrowerForm.get('aadharNumber').valueChanges.subscribe((value) => {
      if (value && value.length > 12 && value.length < 16) {
        this.validAadharLength = true;
        this.enterOtp = false;
        this.counter = 0;
      } else {
        this.validAadharLength = false;
        this.enterOtp = false;
        this.counter = 0;
      }
      this.enterOtp = false;
      this.counter = 0;
      this.CustomerIds = false;
      this.borrowerForm.get('customerIds').reset();
      this.borrowerForm.get('customerIds').disable();
    });
  }

  verifyOtpAadhaar(): void {
    if (this.borrowerForm.get('aadharNumber').value.match(/^(\d)\1+$/g)) {
      this.enterOtp = false;
      this.counter = 0;
      this.invalidAadhaar = false;
    } else if (!this.borrowerForm.get('aadharNumber').value.match(/^(\d)\1+$/g)) {
      this.invalidAadhaar = true;
      if (this.borrowerForm.get('accountHolder').value === 'No') {
        this.CustomerIds = false;
        this.borrowerForm.get('customerIds').reset();
        this.borrowerForm.get('customerIds').disable();
        this.enterOtp = true;
        this.counter = 599;
        const Aadhaar = {
          aadharNumber: this.borrowerForm.value.aadharNumber,
          product: 'PL',
          mobileNumber: this.mobilenumber,
          accountHolder: this.borrowerForm.value.accountHolder,
        };
        this.genericService.getBorrowerOTP(Aadhaar, this.token).subscribe(result => {
          this.borrowerOTPDetails = result;
        }, error => {
        });
      } else {
        this.getCustomerIdData(this.borrowerForm.value.aadharNumber);
      }

      // this.enterOtp = true;
      // this.borrowerForm.get('accountHolder').value === 'No' && this.enterOtp === true ? this.counter = 599 : this.counter = 179;

    } else {
      this.enterOtp = false;
      this.counter = 0;
      this.invalidAadhaar = true;
    }
  }

  getCustomerIdData(value) {
    this.CustomerIds = true;
    this.borrowerForm.get('customerIds').enable();
    this.borrowerForm.get('customerIds').reset();
    var custPayload = {};
    if (value.length === 10) {
      custPayload = {
        panNumber: value,
      }
    } else {
      custPayload = {
        aadharNumber: value,
      }
    }

    this.spinner.show();
    this.genericService.getCustIds(custPayload, this.token).subscribe((result: any) => {
      this.custIds = result.body;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  aadhaarValue(val): void {
    this.CustomerIds = false;
    this.borrowerForm.get('customerIds').reset();
    this.borrowerForm.get('customerIds').disable();
    if (this.borrowerForm.get('aadharNumber').value) {
      if (this.borrowerForm.get('aadharNumber').value.length > 12 && this.borrowerForm.get('aadharNumber').value.length < 16) {
        this.validAadharLength = true;
      }
      else if (this.borrowerForm.get('aadharNumber').value.length === 12) {
        this.validAadharLength = false;
        if (this.borrowerForm.get('aadharNumber').value.split('').slice(0, 1)[0] === "1" ||
          this.borrowerForm.get('aadharNumber').value.split('').slice(0, 1)[0] === "0") {
          this.enterOtp = false;
          this.counter = 0;
          this.invalidAadhaar = false;
        } else {
          this.verifyOtpAadhaar();
        }
      } else if (this.borrowerForm.get('aadharNumber').value.length === 16) {
        this.verifyOtpAadhaar();
        this.validAadharLength = false;
      }
      this.borrowerForm.get('otp').reset();
    }
    this.borrowerForm.get('otp').reset();
  }

  validAccount(val): void {
    if (val === '') {
      this.invalidAccNum = true;
    }
    if (val.length < 14) {
      this.enterOtp = false;
      this.counter = 0;
      this.borrowerForm.get('otp').reset();
    }
  }

  accountValue(val): void {
    if (this.borrowerForm.get('accountNumber').value) {
      if (this.borrowerForm.get('accountNumber').value.match(/^(\d)\1+$/g)) {
        this.enterOtp = false;
        this.counter = 0;
        this.invalidAccNum = false;
      } else if (this.borrowerForm.get('accountNumber').value.length === 14 &&
        this.borrowerForm.get('accountNumber').hasError('pattern') === false &&
        !this.borrowerForm.get('accountNumber').value.match(/^(\d)\1+$/g)) {
        this.enterOtp = true;
        this.counter = 179;
        this.invalidAccNum = true;
        const Account = {
          accountHolder: this.borrowerForm.value.accountHolder,
          accountNumber: this.borrowerForm.value.accountNumber,
          product: 'PL',
          mobileNumber: this.mobilenumber
        };
        this.genericService.getBorrowerOTP(Account, this.token).subscribe(result => {
          this.borrowerOTPDetails = result;
        }, error => {
        });
      } else {
        this.enterOtp = false;
        this.counter = 0;
        this.invalidAccNum = true;
        this.borrowerForm.get('otp').reset();
      }

      //   if((val[5] == '0' && val[6] == '1') || (val[5] == '0' && val[6] == '2'))
      //   {
      //     this.accountNumberInvalid = false;
      //     console.log(this.accountNumberInvalid)
      //   }
      //   else
      //   {
      //     this.accountNumberInvalid = true;
      //     const data = {
      //       "communicationType" : "EMAIL",
      //       "applicationId" : null,
      //       "templateName" : 'leadgenerationplpopup_bankusertocustomer_sms'
      //   }

      //   this.spinner.show()
      //     this.genericService.termsAndConditions(data, this.token).subscribe((res) => {
      //       this.tmsData = res;
      //       this.spinner.hide();
      //     }, err => {
      //       this.spinner.hide();
      //     });

      //     this.dialogRefClose = this.dialogRef.open(this.myDialog, { disableClose: true, closeOnNavigation: false });
      //   }
    }
    this.borrowerForm.get('otp').reset();
  }

  validCustId(value): void {
    if (value) {
      if (value.length < 6) {
        this.validcustIdLength = true;
        this.enterOtp = false;
        this.counter = 0;
        this.borrowerForm.get('otp').reset();
      } else {
        this.validcustIdLength = false;
      }
    }
  }

  custValue(val): void {
    if (this.borrowerForm.get('custId').value) {
      if (this.borrowerForm.get('custId').value.match(/^(\d)\1+$/g)) {
        this.enterOtp = false;
        this.counter = 0;
        this.invalidCustId = false;
      }
      else if (val.length >= 6 && val.length <= 10 && !this.borrowerForm.get('custId').value.match(/^(\d)\1+$/g)) {
        this.enterOtp = true;
        this.counter = 179;
        this.invalidCustId = true;
        const custIdNumber = {
          customerId: this.borrowerForm.value.custId,
          product: 'PL',
          mobileNumber: this.mobilenumber,
          accountHolder: this.borrowerForm.value.accountHolder,
        };

        this.genericService.getBorrowerOTP(custIdNumber, this.token).subscribe(result => {
          this.borrowerOTPDetails = result;
        }, error => {
        });
      } else {
        this.enterOtp = false;
        this.counter = 0;
        this.invalidCustId = true;
        this.borrowerForm.get('otp').reset();
      }
    }
    this.borrowerForm.get('otp').reset();
  }

  selectCustId(id) {
    this.enterOtp = false;
    this.counter = 0;
    this.borrowerForm.get('otp').reset();
    const custIds = {
      customerId: id,
      product: 'PL',
      mobileNumber: this.mobilenumber,
      accountHolder: this.borrowerForm.value.accountHolder,
    };

    this.spinner.show();
    this.genericService.getBorrowerOTP(custIds, this.token).subscribe(result => {
      this.borrowerOTPDetails = result;
      this.enterOtp = true;
      this.counter = 179;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  checkBoxValidation(): void {
    if (this.borrowerForm.get('checkBox').invalid) {
      this.validCheckBox = false;
    } else {
      this.validCheckBox = true;
    }
  }

  panValid(val): void {
    this.CustomerIds = false;
    this.borrowerForm.get('customerIds').reset();
    this.borrowerForm.get('customerIds').disable();
    if (val.length === 10 &&
      this.borrowerForm.get('panNumber').hasError('panName') === false &&
      this.borrowerForm.get('panNumber').hasError('pattern') === false
    ) {
      // this.enterOtp = true;
      // this.counter = 59;
    } else {
      this.enterOtp = false;
      this.counter = 0;
      this.borrowerForm.get('otp').reset();
    }
    // this.enterOtp = false;
    // this.counter = 0;
    // this.borrowerForm.get('otp').reset();
  }

  // panValue(val): void {
  //   if (val.length === 10 &&
  //     this.borrowerForm.get('panNumber').hasError('panName') === false &&
  //     this.borrowerForm.get('panNumber').hasError('pattern') === false
  //   ) {
  //     this.enterOtp = true;
  //     this.counter = 59;
  //     const panNumber = {
  //       panNumber: this.borrowerForm.value.panNumber,
  //       product: 'PL',
  //       mobileNumber: this.mobilenumber,
  //       accountHolder: this.borrowerForm.value.accountHolder,
  //     };

  //     this.genericService.getBorrowerOTP(panNumber, this.token).subscribe(result => {
  //       this.borrowerOTPDetails = result;
  //     }, error => {
  //     });
  //   } else {
  //     this.enterOtp = false;
  //     this.counter = 0;
  //   }
  //   this.borrowerForm.get('otp').reset();
  // }

  panApiIntegrataion(val): void {
    if (val.length === 10 &&
      this.borrowerForm.get('panNumber').hasError('panName') === false &&
      this.borrowerForm.get('panNumber').hasError('pattern') === false) {
      this.spinner.show()
      this.genericService.panService(val, this.token).subscribe(result => {
        this.spinner.hide()
        this.panVerifyDetails = result;
        if (this.panVerifyDetails.Status == 'Valid') {

          this.verifyPan = false;

          this.getCustomerIdData(val);

          // this.enterOtp = true;
          // this.counter = 179;
          // const panNumber = {
          //   panNumber: this.borrowerForm.value.panNumber,
          //   product: 'PL',
          //   mobileNumber: this.mobilenumber,
          //   accountHolder: this.borrowerForm.value.accountHolder,
          // };
          // this.genericService.getBorrowerOTP(panNumber, this.token).subscribe(result => {
          //   this.borrowerOTPDetails = result;
          // }, error => {
          // });
        }
        else {
          this.verifyPan = true;
          this.toastr.error('PAN Number is Invalid', '', { timeOut: 5000 });
        }
      }, error => {
        this.verifyPan = true;
        this.toastr.error('PAN Number is Invalid', '', { timeOut: 5000 });
        this.spinner.hide()
      });

    }
    else {
      this.enterOtp = false;
      this.counter = 0;
      this.verifyPan = true;
      this.borrowerForm.get('otp').reset();
    }

  }

  otpValidate(val): void {
    if (val && val.length === 6) {
      if (val === '111111') {
        this.invalidOtp = false;
      } else {
        this.invalidOtp = true;
      }
    } else {
      this.invalidOtp = true;
    }
  }

  showSelectValue(event): void {
    this.btnCounter = 0;
    this.firstField = true;
    this.CustomerIds = false;
    this.borrowerForm.get('customerIds').reset();
    this.borrowerForm.get('customerIds').disable();
    if (event.value === 'Yes') {
      this.AadharNumber = false;
      this.AccountNumber = false;
      this.PanNumber = false;
      this.CustIdNumber = false;
      this.borrowerForm.get('selectvalue').enable();
      this.borrowerForm.get('selectvalue').reset();
      this.borrowerForm.controls.selectvalue.markAsUntouched()
      this.enterOtp = false;
    } else {
      this.AadharNumber = true;
      this.borrowerForm.patchValue({
        selectvalue: 'Aadhaar / VID'
      });
      this.AccountNumber = false;
      this.PanNumber = false;
      this.CustIdNumber = false;
      this.borrowerForm.get('selectvalue').disable();
      this.borrowerForm.get('accountNumber').disable();
      this.borrowerForm.get('panNumber').disable();
      this.borrowerForm.get('custId').disable();
      this.borrowerForm.get('aadharNumber').enable();
      this.borrowerForm.get('aadharNumber').reset();
      this.enterOtp = false;
      this.borrowerForm.controls.aadharNumber.markAsUntouched();
    }
    this.borrowerForm.get('checkBox').reset();
  }

  selectType(event): void {
    this.verifyPan = true;
    this.enterOtp = false;
    this.counter = 0;
    this.btnCounter = 0;
    this.borrowerForm.get('aadharNumber').reset();
    this.CustomerIds = false;
    this.borrowerForm.get('customerIds').reset();
    this.borrowerForm.get('customerIds').disable();
    if (event.value === 'Account No.' && this.firstField) {
      this.AccountNumber = true;
      this.AadharNumber = false;
      this.CustIdNumber = false;
      this.PanNumber = false;
      this.borrowerForm.get('accountNumber').enable();
      this.borrowerForm.get('accountNumber').reset();
      this.borrowerForm.get('aadharNumber').disable();
      this.borrowerForm.get('custId').disable();
      this.borrowerForm.get('customerIds').disable();
      this.borrowerForm.get('panNumber').disable();
      this.borrowerForm.controls.accountNumber.markAsUntouched();
      this.borrowerForm.get('checkBox').reset();
      this.borrowerForm.get('aadharNumber').reset();
    }
    if (event.value === 'Aadhaar / VID' && this.firstField) {
      this.AccountNumber = false;
      this.AadharNumber = true;
      this.CustIdNumber = false;
      this.PanNumber = false;
      this.borrowerForm.get('accountNumber').disable();
      this.borrowerForm.get('aadharNumber').enable();
      this.borrowerForm.get('aadharNumber').reset();
      this.borrowerForm.get('custId').disable();
      this.borrowerForm.get('panNumber').disable();
      this.borrowerForm.controls.aadharNumber.markAsUntouched();
      this.borrowerForm.get('checkBox').reset();
      this.borrowerForm.get('accountNumber').reset();
    }
    if (event.value === 'Customer Id' && this.firstField) {
      this.AccountNumber = false;
      this.AadharNumber = false;
      this.CustIdNumber = true;
      this.PanNumber = false;
      this.borrowerForm.get('custId').enable();
      this.borrowerForm.get('custId').reset();
      this.borrowerForm.get('accountNumber').disable();
      this.borrowerForm.get('aadharNumber').disable();
      this.borrowerForm.get('panNumber').disable();
      this.borrowerForm.get('customerIds').disable();
      this.borrowerForm.controls.custId.markAsUntouched();
      this.borrowerForm.get('checkBox').reset();
    }
    if (event.value === 'Pan' && this.firstField) {
      this.AccountNumber = false;
      this.AadharNumber = false;
      this.CustIdNumber = false;
      this.PanNumber = true;
      this.borrowerForm.get('accountNumber').disable();
      this.borrowerForm.get('aadharNumber').disable();
      this.borrowerForm.get('custId').disable();
      this.borrowerForm.get('panNumber').enable();
      this.borrowerForm.get('panNumber').reset();
      this.borrowerForm.controls.panNumber.markAsUntouched();
      this.borrowerForm.get('checkBox').reset();
    }
  }

  countDown(): void {
    this.interval = setInterval(() => {
      if (this.counter > 0) {
        this.counter--;
      } else {
        this.counter = 0;
      }
    }, 1000);
  }

  Resend(btn): void {
    if (btn) {
      this.btnCounter += 1;
      if (this.btnCounter > 2) {
        this.resend = false;
        this.counter = 0;
        this.dialogRef.open(ResendOtpDialogComponent, { disableClose: true });
      }
      else {
        this.borrowerForm.get('otp').reset();
        if (this.borrowerForm.get('selectvalue').value === 'Aadhaar / VID' && this.borrowerForm.get('accountHolder').value === 'No') {
          this.counter = 599;
        } else {
          this.counter = 179;
        }


        if (this.borrowerForm.get('selectvalue').value === 'Aadhaar / VID') {
          this.payload = {
            accountHolder: this.borrowerForm.value.accountHolder,
            aadharNumber: this.borrowerForm.value.aadharNumber,
            product: 'PL',
            mobileNumber: this.mobilenumber,
          };
        }

        if (this.borrowerForm.get('selectvalue').value === 'Account No.') {
          this.payload = {
            accountNumber: this.borrowerForm.value.accountNumber,
            product: 'PL',
            mobileNumber: this.mobilenumber,
            accountHolder: this.borrowerForm.value.accountHolder,
          };
        }

        if (this.borrowerForm.get('selectvalue').value === 'Customer Id') {
          this.payload = {
            accountHolder: this.borrowerForm.value.accountHolder,
            customerId: this.borrowerForm.value.custId,
            product: 'PL',
            mobileNumber: this.mobilenumber,
          };
        }

        if (this.borrowerForm.get('selectvalue').value === 'Pan') {
          this.payload = {
            accountHolder: this.borrowerForm.value.accountHolder,
            panNumber: this.borrowerForm.value.panNumber,
            product: 'PL',
            mobileNumber: this.mobilenumber,
          };
        }

        this.genericService.getBorrowerOTP(this.payload, this.token).subscribe(result => {
          this.resendAadharOTP = result;
        }, error => {
        });
      }
    }
  }

  submit(): void {
    this.checkBoxValidation();

    // if(this.accountNumberInvalid == true)
    // {
    //   this.dialogRefClose = this.dialogRef.open(this.myDialog, { disableClose: true, closeOnNavigation: false });
    // }

    if (this.borrowerForm.get('selectvalue').value === 'Pan') {
      if (this.verifyPan == true) {
        this.toastr.error('PAN Number is Invalid', '', { timeOut: 5000 });
      }
    }
    if (!this.borrowerForm.invalid && this.invalidOtp === false) {
      if (this.borrowerForm.get('selectvalue').value === 'Aadhaar / VID' && this.borrowerForm.value.accountHolder === 'No') {
        this.submitPayload = {
          accountHolder: this.borrowerForm.value.accountHolder,
          aadharNumber: this.borrowerForm.value.aadharNumber,
          product: 'PL',
          mobileNumber: this.mobilenumber,
          otp: this.borrowerForm.value.otp,
        };
      } else if (this.borrowerForm.get('selectvalue').value === 'Aadhaar / VID' && this.borrowerForm.value.accountHolder === 'Yes') {
        this.submitPayload = {
          accountHolder: this.borrowerForm.value.accountHolder,
          customerId: this.borrowerForm.value.customerIds,
          product: 'PL',
          mobileNumber: this.mobilenumber,
          otp: this.borrowerForm.value.otp,
        };
      }

      if (this.borrowerForm.get('selectvalue').value === 'Account No.') {
        this.submitPayload = {
          accountHolder: this.borrowerForm.value.accountHolder,
          accountNumber: this.borrowerForm.value.accountNumber,
          product: 'PL',
          mobileNumber: this.mobilenumber,
          otp: this.borrowerForm.value.otp,
        };
      }

      if (this.borrowerForm.get('selectvalue').value === 'Customer Id') {
        this.submitPayload = {
          accountHolder: this.borrowerForm.value.accountHolder,
          customerId: this.borrowerForm.value.custId,
          product: 'PL',
          mobileNumber: this.mobilenumber,
          otp: this.borrowerForm.value.otp,
        };
      }

      if (this.borrowerForm.get('selectvalue').value === 'Pan' && this.borrowerForm.value.accountHolder === 'No') {
        this.submitPayload = {
          accountHolder: this.borrowerForm.value.accountHolder,
          panNumber: this.borrowerForm.value.panNumber.toUpperCase(),
          product: 'PL',
          mobileNumber: this.mobilenumber,
          otp: this.borrowerForm.value.otp,
        };
      } else if (this.borrowerForm.get('selectvalue').value === 'Pan' && this.borrowerForm.value.accountHolder === 'Yes') {
        this.submitPayload = {
          accountHolder: this.borrowerForm.value.accountHolder,
          customerId: this.borrowerForm.value.customerIds,
          product: 'PL',
          mobileNumber: this.mobilenumber,
          otp: this.borrowerForm.value.otp,
        };
      }
      this.spinner.show();
      this.genericService.verifyBorrowerOTP(this.submitPayload, this.token).subscribe(result => {
        this.spinner.hide();
        this.borrowerVerifyDetails = result;
        // ================================temprary for aadhar issue===============================================
        if (this.borrowerVerifyDetails.body.entity.applicationId === null) {
          localStorage.removeItem('applicationId');
          this.service.loginDetails.next(this.appId);
          this.service.loan.next(6.5);
          this.service.loan1.next(17);
          this.service.borrowerDetails.next(this.borrowerForm);
          if (this.borrowerForm.value.accountHolder === 'Yes' && this.borrowerVerifyDetails.body.entity.preapprovedamt) {
            if (this.borrowerForm.value.accountHolder === 'Yes' && this.borrowerVerifyDetails.body.entity.preapprovedamt !== 0) {
              this.route.navigate(['/pre-approved-details']);
            } else {
              this.route.navigate(['/user-input/loan-details']);
            }
          } else {
            this.route.navigate(['/user-input/loan-details']);
          }
        } else {
          this.appId = this.borrowerVerifyDetails.body.entity.applicationId;
          this.appPack = this.borrowerVerifyDetails.body.entity.applPackage;
          this.cpId = this.borrowerVerifyDetails.body.entity.cpId;
          this.accountHolder = this.borrowerForm.value.accountHolder;
          localStorage.setItem('applicationId', this.appId);
          localStorage.setItem('appPackId', this.appPack);
          localStorage.setItem('cpId', this.cpId);
          localStorage.setItem('accountHolder', this.accountHolder);
          this.service.loginDetails.next(this.appId);
          this.service.loan.next(6.5);
          this.service.loan1.next(17);
          this.service.borrowerDetails.next(this.borrowerForm);
          const screenDetails = { "screenNumber": 3, "screenName": "Borrower details", "applicationId": this.appId, "product": "PL" }
          this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
          if (this.borrowerForm.value.accountHolder === 'Yes' && this.borrowerVerifyDetails.body.entity.preapprovedamt) {
            if (this.borrowerForm.value.accountHolder === 'Yes' && this.borrowerVerifyDetails.body.entity.preapprovedamt !== 0) {
              this.route.navigate(['/pre-approved-details']);
            } else {
              this.route.navigate(['/user-input/loan-details']);
            }
          } else {
            this.route.navigate(['/user-input/loan-details']);
          }
        }

        // =====================================================================================
        // this.appId = this.borrowerVerifyDetails.body.entity.applicationId;
        // this.appPack = this.borrowerVerifyDetails.body.entity.applPackage;
        // this.cpId = this.borrowerVerifyDetails.body.entity.cpId;
        // this.accountHolder = this.borrowerForm.value.accountHolder;
        // localStorage.setItem('applicationId', this.appId);
        // localStorage.setItem('appPackId', this.appPack);
        // localStorage.setItem('cpId', this.cpId);
        // localStorage.setItem('accountHolder', this.accountHolder);
        // this.service.loginDetails.next(this.appId);
        // this.service.loan.next(6.5);
        // this.service.loan1.next(17);
        // this.service.borrowerDetails.next(this.borrowerForm);
        // const screenDetails = { "screenNumber": 3, "screenName": "Borrower details", "applicationId": this.appId, "product": "PL" }
        // this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
        // if (this.borrowerForm.value.accountHolder === 'Yes' && this.borrowerVerifyDetails.body.entity.preapprovedamt) {
        //   if (this.borrowerForm.value.accountHolder === 'Yes' && this.borrowerVerifyDetails.body.entity.preapprovedamt !== 0) {
        //     this.route.navigate(['/pre-approved-details']);
        //   } else {
        //     this.route.navigate(['/user-input/loan-details']);
        //   }
        // } else {
        //   this.route.navigate(['/user-input/loan-details']);
        // }
      }, error => {
        this.spinner.hide();
      });
    } else {
      this.borrowerForm.controls.accountHolder.markAsTouched();
      this.borrowerForm.controls.selectvalue.markAsTouched();
    }

    if (this.borrowerForm.value.accountHolder) {
      if (this.borrowerForm.value.accountHolder === 'No') {
        this.borrowerForm.controls.aadharNumber.markAsTouched();
      } else {
        this.borrowerForm.controls.selectvalue.markAsTouched();
      }
    }

    if (this.borrowerForm.value.selectvalue) {
      if (this.borrowerForm.value.selectvalue === 'Aadhaar / VID') {
        this.borrowerForm.controls.aadharNumber.markAsTouched();
      } else if (this.borrowerForm.value.selectvalue === 'Account No.') {
        this.borrowerForm.controls.accountNumber.markAsTouched();
      } else if (this.borrowerForm.value.selectvalue === 'Customer Id') {
        this.borrowerForm.controls.custId.markAsTouched();
      } else if (this.borrowerForm.value.selectvalue === 'Pan') {
        this.borrowerForm.controls.panNumber.markAsTouched();
      }
    }

    if (this.enterOtp) {
      this.borrowerForm.controls.otp.markAsTouched();
    }
  }
}

