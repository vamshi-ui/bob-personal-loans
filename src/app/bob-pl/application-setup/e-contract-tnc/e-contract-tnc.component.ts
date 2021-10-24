import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Subscription, timer } from 'rxjs';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import pdfMake from 'pdfmake/build/pdfmake';
import { ResendOtpDialogComponent } from '../../resend-otp-dialog/resend-otp-dialog.component';
import { MatDialog } from '@angular/material';
import { GenericService } from 'src/app/shared/services/generic.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e-contract-tnc',
  templateUrl: './e-contract-tnc.component.html',
  styleUrls: ['./e-contract-tnc.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EContractTncComponent implements OnInit {
  saveCustomerScreenDetails: Object;
  src: any;
  stageOneTwo: boolean = false;
  stageOneOne: boolean = false;
  intervalId: any;
  continueButton: boolean = false;

  _base64ToArrayBuffer(base64) {
    var binary_string = base64.replace(/\\n/g, "");
    binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  public showOTP: boolean;
  public showAgreement: boolean;
  public otpForm: FormGroup;
  public counter: any = -1;
  public enterOtp: any = false;
  public countDown: Subscription;
  public showCheckbox: boolean;
  public valid: boolean;
  verifyOTP: FormGroup;
  message = '';
  public eContract: FormGroup;
  public otpDiv;
  public invalidOtp;
  resendBtn;
  btnCounter = 0;
  validCheckBox: boolean;
  token: any;
  applicationId: any;
  appPackId: any;
  getResponse: any;
  createResponse: any;

  @ViewChild('firstLine', { static: false }) firstLine: ElementRef;
  @ViewChild('secondLine', { static: false }) secondLine: ElementRef;
  @ViewChild('thirdLine', { static: false }) thirdLine: ElementRef;
  @ViewChild('fourthLine', { static: false }) fourthLine: ElementRef;
  @ViewChild('fifthLine', { static: false }) fifthLine: ElementRef;
  @ViewChild('sixthLine', { static: false }) sixthLine: ElementRef;
  @ViewChild('seventhLine', { static: false }) seventhLine: ElementRef;
  @ViewChild('contract1', { static: false }) contract1: ElementRef;
  @ViewChild('contract2', { static: false }) contract2: ElementRef;
  @ViewChild('contract3', { static: false }) contract3: ElementRef;
  @ViewChild('contract4', { static: false }) contract4: ElementRef;
  @ViewChild('contract5', { static: false }) contract5: ElementRef;
  @ViewChild('contract6', { static: false }) contract6: ElementRef;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private dialogRef: MatDialog,
    private genericService: GenericService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.verificationForm();
    this.eContractForm();
    this.getToken();
    this.getESignDoc();
  }

  getESignDoc() {
    this.spinner.show();
    const payload = {
      appPackId: this.applicationId
    }
    this.genericService.getESignDocument(payload, this.token).subscribe(result => {
      this.getResponse = result;
      this.spinner.hide();
      // this.src = this._base64ToArrayBuffer(this.getResponse.fileData);
      this.src = this.getResponse.fileData;
      this.pdfrender(this.src);

      if (this.getResponse.isEsigned === 0 && this.getResponse.isInitiated === 0) {
        this.stageOneOne = true;
      }
      if (this.getResponse.isEsigned === 0 && this.getResponse.isInitiated === 1) {
        this.stageOneTwo = true;
        this.setStatusInterval();
      }
      if (this.getResponse.isEsigned === 1 && this.getResponse.isInitiated === 1) {

      }
    }, (error) => {
      this.spinner.hide();
  });
  }

  pdfrender(base64) {
    var objbuilder = '';
    objbuilder += ('<object width="100%" height="100%" data="data:application/pdf;base64,');
    var myBase64string = base64;
    objbuilder += (myBase64string);
    objbuilder += ('" type="application/pdf" class="internal">');
    objbuilder += ('<embed src="data:application/pdf;base64,');
    objbuilder += (myBase64string);
    objbuilder += ('" type="application/pdf" />');
    objbuilder += ('</object>');
    setTimeout(() => {
      document.getElementById("demo").innerHTML = objbuilder;
    }, 500);
  }

  continueToESign() {
    const payload = {
      appPackId: this.applicationId
    }
    this.spinner.show();
    this.genericService.eSignCreation(payload, this.token).subscribe(result => {
      this.createResponse = result;
      this.spinner.hide();
      this.stageOneOne = false;
      this.stageOneTwo = true;
      this.setStatusInterval();
    }, (error) => {
      this.spinner.hide();
    });
  }

  setStatusInterval() {
    // this.gatewayLoader = true;
    this.intervalId = setInterval(() =>
      this.getESignedStatus()
      , 30000);
  }

  getESignedStatus() {
    const payload = {
      appPackId: this.applicationId
    }
    this.genericService.eSignStatus(payload, this.token).subscribe((resp: any) => {
      // this.createResponse = resp;
      if (resp) {
        if (resp.isEsigned === 1 && resp.isEsignedInitiated === 1) {
          // this.continueButton = true;
          clearInterval(this.intervalId);
          this.getESignDoc();
        } else {
          // clearInterval(this.intervalId);
        }
      }
    });
  }

  continue() {
    clearInterval(this.intervalId);
    const screenDetails = { "screenNumber": 24, "screenName": "E contract", "applicationId": this.applicationId, "product": "PL" }
    this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
    this.router.navigate(['/application-setup/auto-debit-setup']);
  }

  // downloadFile() {
  //   this.http.get(
  //     'https://mapapi.apispark.net/v1/images/Granizo.pdf').subscribe(
  //       (response) => {
  //         var mediaType = 'application/pdf';
  //         var blob = new Blob([response.fileData], {type: mediaType});
  //         var filename = 'test.pdf';
  //         saveAs(blob, filename);
  //       });
  // }

  eContractForm() {
    this.eContract = this.formBuilder.group({
      checkbox: ['']
    });
  }

  getToken(): void {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
    this.appPackId = localStorage.getItem('appPackId');
  }

  checkboxEvent(event) {

    if (event.checked === true) {
      this.validCheckBox = true;
    }
    else {
      this.validCheckBox = false;
    }
    this.otpDiv = !this.otpDiv;
    --this.counter;
    this.countDown.unsubscribe();
    this.givenTime(60);
    this.verifyOTP.reset();
  }

  otpValidate(val) {
    if (val === '111111') {
      this.invalidOtp = false;
    } else {
      this.invalidOtp = true;
    }
  }

  verificationForm() {
    this.verifyOTP = this.formBuilder.group({
      otp1: ['', Validators.required]
    });
  }

  changeValue() {
    this.valid = false;
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  openOtp(btn) {
    if (btn) {
      this.btnCounter += 1;
      if (this.btnCounter > 2) {
        this.counter = 0;
        this.dialogRef.open(ResendOtpDialogComponent, { disableClose: true });
      }
      else {
        this.enterOtp = true;
        this.countDown.unsubscribe();
        --this.counter;
        this.givenTime(29);
        this.verifyOTP.reset();
      }
    }
  }

  openOTP() {
    this.showOTP = true;
    // tslint:disable-next-line: no-non-null-assertion
    if (this.counter === 0 || this.counter! < 0) {
      this.enterOtp = true;
      this.givenTime(59);
    } else {
      this.counter = 0;
      this.resendBtn = true;
    }
    this.verifyOTP.reset();
  }

  givenTime(inp: number) {
    this.counter = inp;
    this.countDown = timer(0, 1000).subscribe((t) => {
      --this.counter;
      if (this.counter === 0 || this.counter < 0) {
        this.counter = 0;
        this.countDown.unsubscribe();
      }
    });
  }

  openAgreement() {
    this.verifyOTP.get('otp1').markAllAsTouched();
    if (this.verifyOTP.valid && this.eContract.valid && this.invalidOtp == false) {
      this.showAgreement = true;
    }
    else {
      this.showAgreement = false;
    }
  }

  async downloadAsPDF() {
    if (this.showCheckbox === true) {
      const contract1 = htmlToPdfmake(this.contract1.nativeElement.innerHTML);
      const contract2 = htmlToPdfmake(this.contract2.nativeElement.innerHTML);
      const contract3 = htmlToPdfmake(this.contract3.nativeElement.innerHTML);
      const contract4 = htmlToPdfmake(this.contract4.nativeElement.innerHTML);
      const contract5 = htmlToPdfmake(this.contract5.nativeElement.innerHTML);
      const documentDefinition = {
        content: [{
          columns: [{
            image: await this.getBase64ImageFromURL('../assets/images/BOB-Group-logo.svg'),
            marginTop: 20,
            marginBottom: 20,
            width: 100,
            height: 50,

          },
          {
            image: await this.getBase64ImageFromURL('../assets/images/bob-world-logo.svg'),
            marginTop: 20,
            marginBottom: 20,
            width: 100,
            height: 50,
          }]
        },

        { text: contract1, style: 'first' },
        { text: contract2, style: 'first' },
        { text: contract3, style: 'first' },
        { text: contract4, style: 'first' },
        { text: contract5, style: 'first' },

        ],
        styles: {
          first: {
            fontSize: 12,
            marginBottom: 10,
            alignment: 'justify',
          },
        }
      };

      pdfMake.createPdf(documentDefinition).download('e-contract-tnc-2.pdf');
    } else {
      const first = htmlToPdfmake(this.firstLine.nativeElement.innerHTML);
      const second = htmlToPdfmake(this.secondLine.nativeElement.innerHTML);
      const third = htmlToPdfmake(this.thirdLine.nativeElement.innerHTML);
      const fourth = htmlToPdfmake(this.fourthLine.nativeElement.innerHTML);
      const fifth = htmlToPdfmake(this.fifthLine.nativeElement.innerHTML);
      const sixth = htmlToPdfmake(this.sixthLine.nativeElement.innerHTML);
      const seventh = htmlToPdfmake(this.seventhLine.nativeElement.innerHTML);
      const documentDefinition = {
        content: [{
          columns: [{
            image: await this.getBase64ImageFromURL('../assets/images/BOB-Group-logo.svg'),
            marginTop: 20,
            marginBottom: 20,
            width: 100,
            height: 50,
          },
          {
            image: await this.getBase64ImageFromURL('../assets/images/bob-world-logo.svg'),
            marginTop: 20,
            marginBottom: 20,
            width: 100,
            height: 50,
          }]
        },
        { text: first, style: 'first' },
        { text: second, style: 'first' },
        { text: third, style: 'first' },
        { text: fourth, style: 'first' },
        { text: fifth, style: 'first' },
        { text: sixth, style: 'first' },
        { text: seventh, style: 'first' },
        ],
        styles: {
          first: {
            fontSize: 12,
            marginBottom: 10,
            alignment: 'justify',
          },
        }
      };
      pdfMake.createPdf(documentDefinition).download('e-contract-tnc-1.pdf');
    }
  }

  async downloadPDF() {
    if (this.showCheckbox === true || this.showAgreement === true) {
      const first = htmlToPdfmake(this.firstLine.nativeElement.innerHTML);
      const second = htmlToPdfmake(this.secondLine.nativeElement.innerHTML);
      const third = htmlToPdfmake(this.thirdLine.nativeElement.innerHTML);
      const fourth = htmlToPdfmake(this.fourthLine.nativeElement.innerHTML);
      const fifth = htmlToPdfmake(this.fifthLine.nativeElement.innerHTML);
      const sixth = htmlToPdfmake(this.sixthLine.nativeElement.innerHTML);
      const seventh = htmlToPdfmake(this.seventhLine.nativeElement.innerHTML);
      const contract1 = htmlToPdfmake(this.contract1.nativeElement.innerHTML);
      const contract2 = htmlToPdfmake(this.contract2.nativeElement.innerHTML);
      const contract3 = htmlToPdfmake(this.contract3.nativeElement.innerHTML);
      const contract4 = htmlToPdfmake(this.contract4.nativeElement.innerHTML);
      const contract5 = htmlToPdfmake(this.contract5.nativeElement.innerHTML);
      const contract6 = htmlToPdfmake(this.contract6.nativeElement.innerHTML);
      const documentDefinition = {
        content: [{
          columns: [{
            image: await this.getBase64ImageFromURL('../assets/images/BOB-Group-logo.svg'),
            marginTop: 20,
            marginBottom: 20,
            width: 100,
            height: 50,
          },
          {
            image: await this.getBase64ImageFromURL('../assets/images/bob-world-logo.svg'),
            marginTop: 20,
            marginBottom: 20,
            width: 100,
            height: 50,
          }]
        },
        { text: first, style: 'first' },
        { text: second, style: 'first' },
        { text: third, style: 'first' },
        { text: fourth, style: 'first' },
        { text: fifth, style: 'first' },
        { text: sixth, style: 'first' },
        { text: seventh, style: 'first' },
        { text: contract1, style: 'first' },
        { text: contract2, style: 'first' },
        { text: contract3, style: 'first', pageBreak: 'before' },
        { text: contract4, style: 'first' },
        { text: contract5, style: 'first' },
        { text: contract6, style: 'signed' }
        ],
        styles: {
          first: {
            fontSize: 12,
            marginBottom: 10,
            alignment: 'justify',
          },
          signed: {
            fontSize: 12,
            marginBottom: 10,
            marginLeft: 350,
            alignment: 'justify'
          }
        }
      };
      pdfMake.createPdf(documentDefinition).download('e-contract-tnc.pdf');
    }
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.setAttribute('crossOrigin', 'annonymous');

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }



}
