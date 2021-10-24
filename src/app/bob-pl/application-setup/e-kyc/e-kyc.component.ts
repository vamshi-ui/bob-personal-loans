import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, timer, merge } from 'rxjs';
import { ValidatorService } from 'src/app/shared/validations/validator.service';
import { MatDialog } from '@angular/material';
import { ResendOtpDialogComponent } from '../../resend-otp-dialog/resend-otp-dialog.component';
import { GenericService } from '../../../shared/services/generic.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-e-kyc',
  templateUrl: './e-kyc.component.html',
  styleUrls: ['./e-kyc.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EKycComponent implements OnInit {
  saveCustomerScreenDetails: Object;
  appId: string;
  token: string;
  counter: any = 0;
  ekycForm: FormGroup;
  valid: any;
  message: any;
  resend: boolean;
  interval: any;
  error = false;
  aadharVal = '';
  invalidAadhaar: boolean;
  btnCounter = 0;
  validCheckBox: boolean;
  hideOtp = true;


  constructor(
    private formBuilder: FormBuilder,
    public validator: ValidatorService,
    public route: Router,
    private dialogRef: MatDialog,
    private genericService: GenericService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.aadhaarForm();
    this.countDown();
    this.getToken();
    if (this.ekycForm.get('aadhar').errors) {
      this.ekycForm.get('otp1').disable();
    }
    this.resetCheckBox();
  }

  getToken(): void {
    this.token = localStorage.getItem('token');
    this.appId = localStorage.getItem('applicationId');
  }

  openOtp(btn): void {
    if (btn) {
      this.btnCounter += 1;
      if (this.btnCounter > 2) {
        this.counter = 0;
        this.dialogRef.open(ResendOtpDialogComponent, { disableClose: true });
      }
      else {
        this.counter = 599;
        this.ekycForm.get('otp1').reset();
      }
    }
  }

  checkBoxValidation() {
    if (this.ekycForm.get('checkBox').invalid) {
      this.validCheckBox = false;
    }
    else {
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

  aadhaarForm() {
    this.ekycForm = this.formBuilder.group({
      aadhar: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.pattern(`^[2-9][0-9-]*$`),
        ],
      ],
      otp1: this.validator.borrowerDetails.accountHolder,
      checkBox: this.validator.borrowerDetails.checkBox,
    });
  }

  resetCheckBox(): void {
    const mergeValues = merge(
      this.ekycForm.get('aadhar').valueChanges,
      this.ekycForm.get('otp1').valueChanges
    );

    mergeValues.subscribe(() => {
      this.ekycForm.get('checkBox').reset();
    })
  }

  alignAadhar(val): void {
    this.ekycForm.get('aadhar').valueChanges.subscribe((value) => {
        this.counter = 0;
        this.ekycForm.get('otp1').disable();
        this.resend = false;
        this.ekycForm.get('otp1').reset();
        if(value.match(/^(\d)\1+$/g)) {
          this.counter = 0;
          this.ekycForm.get('otp1').reset();
          this.ekycForm.get('otp1').disable();
          this.invalidAadhaar = false;
        } else {
          this.invalidAadhaar = true;
        }
    });
  }

  getOtp(val): void {
    if(this.ekycForm.get('aadhar').value) {
    if (this.ekycForm.get('aadhar').value.length === 12 &&
      this.ekycForm.get('aadhar').hasError('pattern') === false
      && !this.ekycForm.value.aadhar.match(/^(\d)\1+$/g)) {
      const payload = {
        aadharNumber: this.ekycForm.value.aadhar,
        product: 'PL',
        applicationId: this.appId,
      }
      this.genericService.ekycSendOtp(payload, this.token).subscribe((result) => {
        this.counter = 599;
        this.resend = true;
        this.invalidAadhaar = true;
        this.ekycForm.get('otp1').enable();
      }, error => {
      });
    } else {
      this.counter = 0;
      this.resend = false;
      this.invalidAadhaar = false;
      this.ekycForm.get('otp1').disable();
    }
  }
  }

  otpNumber(val): void {
    if (val.length === 6) {
      this.error = false;
    } else if (val.length !== 6) {
      this.error = true;
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

  onSubmit() {
    this.checkBoxValidation();
    if (this.ekycForm.valid && this.error == false && this.invalidAadhaar == true) {

      if (this.counter === 0) {
        this.error = true;
      } else {
        const payLoad = {
          aadharNumber: this.ekycForm.value.aadhar,
          product: 'PL',
          otp: this.ekycForm.value.otp1,
          applicationId: this.appId,
        }
        this.spinner.show();
        this.genericService.ekycVerifyOtp(payLoad, this.token).subscribe((result) => {
          this.spinner.hide();
          const screenDetails = { "screenNumber": 25, "screenName": "E KYC", "applicationId": this.appId, "product": "PL" }
          this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
          this.route.navigate(['/application-setup/e-contract']);
        }, error => {
          this.spinner.hide();
        });
      }
    }
  }
}
