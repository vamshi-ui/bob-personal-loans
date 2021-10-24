
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormGroup, FormControl, Validators, FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { ValidatorService } from '../../../shared/validations/validator.service';
import { GenericService } from '../../../shared/services/generic.service';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { ResendOtpDialogComponent } from '../../resend-otp-dialog/resend-otp-dialog.component';
import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class LoginComponent implements OnInit {
  validCheckBox: boolean;
  interval: any;
  public counter: any = 0;
  loginForm: FormGroup;
  resend: boolean;
  error: boolean;
  token: string;
  data: object;
  responseOTP: object;
  validOTP: any;
  btnCounter = 0;
  otpExpired: boolean;
  getCustomerDetailsData: any;
  hideOtp = true;
  mobilenumber: any;

  constructor(private formBuilder: FormBuilder,
    public validator: ValidatorService,
    public route: Router,
    private genericService: GenericService,
    private service: ComponentInteractionService,
    private dialogRef: MatDialog,
    private spinner: NgxSpinnerService) {
  }
  ngOnInit(): void {
    this.mobileForm();
    this.serviceGenerate();
  }
  mobileForm() {
    this.loginForm = this.formBuilder.group({
      mobileNumber: this.validator.valid.mobileNumber,
      otp: this.validator.borrowerDetails.accountHolder,
      checkBox: this.validator.borrowerDetails.checkBox,
      product: 'PL'
    });
    this.loginForm.get('otp').disable();
    this.countDown();
  }
  serviceGenerate() {
    this.token = localStorage.getItem('token');
  }
  otpService(val): void {
    if (
      val.length === 10 &&
      this.loginForm.get('mobileNumber').hasError('pattern') === false && this.loginForm.get('mobileNumber').hasError('misMatch') === false
    ) {
      this.otpExpired = false;
      this.btnCounter = 0;
      this.genericService.generateOTP(this.loginForm.value, this.token).subscribe(result => {
        this.responseOTP = result;
      }, error => {
      });
      this.counter = 179;
      this.resend = true;
      this.loginForm.get('otp').enable();
      this.mobilenumber = this.loginForm.value.mobileNumber;
    } else {
      this.mobilenumber = '';
      this.counter = 0;
      this.resend = false;
      this.loginForm.get('otp').disable();
    }
    this.loginForm.get('otp').reset();
    this.loginForm.get('checkBox').reset();
  }

  otpValidate(val) {
    if (val === '111111') {
      this.error = false;
    } else {
      this.error = true;
    }
  }
  countDown() {
    this.interval = setInterval(() => {
      if (this.counter > 0) {
        this.counter--;
      } else {
        this.counter = 0;
      }
    }, 1000);
  }
  resendOtp(btn): void {
    if (btn) {
      this.btnCounter += 1;
      if (this.btnCounter > 2) {
        this.otpExpired = true;
        this.resend = false;
        this.counter = 0;
        this.dialogRef.open(ResendOtpDialogComponent, { disableClose: true });
      }
      else {
        this.counter = 179;
        this.loginForm.get('otp').reset();
        this.resend = true;
        this.otpExpired = false;
        this.genericService.generateOTP(this.loginForm.value, this.token).subscribe(result => {
          this.responseOTP = result;
        }, error => {
        });
      }
    }
  }
  checkBoxValidation(): void {
    if (this.loginForm.get('checkBox').invalid) {
      this.validCheckBox = false;
    } else {
      this.validCheckBox = true;
    }
  }
  onCheck(event): void {
    if (event.checked === true) {
      this.validCheckBox = true;
    } else {
      this.validCheckBox = false;
    }
  }
  onSubmit(): void {
    this.checkBoxValidation();
    this.loginForm.get('checkBox').value;
    this.loginForm.get('otp').markAsTouched();
    if (this.loginForm.valid && this.error === false) {
      if (this.counter === 0) {
        this.error = true;
      }
      else if (this.counter !== 0) {
        this.spinner.show();
        this.genericService.validateOTP(this.loginForm.value, this.token).subscribe((result) => {
          this.error = false;
          this.spinner.hide();
          this.validOTP = result;
          if (this.validOTP.statusCode == '200' || this.validOTP.statusCode == '202') {
            const getCustomerDetails =
              { "mobile": this.loginForm.value.mobileNumber, "product": "PL" }
            this.genericService.getCustomerScreen(getCustomerDetails, this.token).subscribe(x => {
              this.getCustomerDetailsData = x;

              localStorage.setItem('applicationId', this.getCustomerDetailsData.appId)
              if (this.getCustomerDetailsData.screenName === null) {
                this.route.navigate(['/borrower-details']);
              } else {
                this.route.navigate([this.getCustomerDetailsData.screenEndpoint]);
                // this.route.navigate(['/borrower-details']);
              }
            })
          }
        }, error => {
          this.spinner.hide();
          this.error = true;
        });
        this.service.mobileNo.next(this.loginForm.value.mobileNumber);
      }
    }
  }
}
