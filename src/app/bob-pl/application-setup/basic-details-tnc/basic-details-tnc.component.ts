import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
// declare let jsPDF: any;
import htmlToPdfmake from 'html-to-pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import pdfMake from 'pdfmake/build/pdfmake';
import { Router } from '@angular/router';
import { GenericService } from '../../../shared/services/generic.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../../shared/validations/validator.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-basic-details-tnc',
  templateUrl: './basic-details-tnc.component.html',
  styleUrls: ['./basic-details-tnc.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BasicDetailsTncComponent implements OnInit {
  saveCustomerScreenDetails: Object;
  tncData: any;
  applicationId: string;
  token: string;
  validCheckBox: boolean;
  tncForm: FormGroup;

  @ViewChild('first', { static: false }) first: ElementRef;
  @ViewChild('second', { static: false }) second: ElementRef;
  @ViewChild('third', { static: false }) third: ElementRef;
  @ViewChild('fourth', { static: false }) fourth: ElementRef;
  @ViewChild('fifth', { static: false }) fifth: ElementRef;
  @ViewChild('sixth', { static: false }) sixth: ElementRef;
  @ViewChild('seventh', { static: false }) seventh: ElementRef;

  customerStatus: any;
  loanAmount: number;

  constructor(private route: Router,
    private genericService: GenericService,
    private formBuilder: FormBuilder,
    private validatorService: ValidatorService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getToken();
    this.basicTncForm();
    this.gettingSanctionLetter();
  }

  getToken(): void {
    this.token = localStorage.getItem('token');
    this.applicationId = localStorage.getItem('applicationId');
    this.getCustomerStatus();
  }

  basicTncForm() {
    this.tncForm = this.formBuilder.group({
      checkBox: this.validatorService.valid.checkBox
    });
  }

  getCustomerStatus() {
    const payload = {
      applicationId: this.applicationId
    }
    this.genericService.getCustomerStatus(payload, this.token).subscribe(result => {
      this.customerStatus = result;
      this.loanAmount = parseInt(this.customerStatus.sanctionLoanAmount);
    });
  }

  gettingSanctionLetter() {
    this.spinner.show();
    const data = {
      communicationType: "EMAIL",
      applicationId: this.applicationId,
      templateName: "personalloan",
    }
    this.genericService.getSanctionLetter(data, this.token).subscribe((res: any) => {
      this.tncData = res.pdfData;
      this.pdfrender(this.tncData);
      this.spinner.hide();
    }, err => {
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

  downloadPDF() {
    // pdfMake.createPdf(this.tncData).download('basic-tnc.pdf');
  }

  // async downloadPDF() {
  //   const one = htmlToPdfmake(this.first.nativeElement.innerHTML);
  //   const two = htmlToPdfmake(this.second.nativeElement.innerHTML);
  //   const three = htmlToPdfmake(this.third.nativeElement.innerHTML);
  //   const four = htmlToPdfmake(this.fourth.nativeElement.innerHTML);
  //   const five = htmlToPdfmake(this.fifth.nativeElement.innerHTML);
  //   const six = htmlToPdfmake(this.sixth.nativeElement.innerHTML);
  //   const seven = htmlToPdfmake(this.seventh.nativeElement.innerHTML);

  // const documentDefinition = {
  //   content: [
  //     {
  //       image: await this.getBase64ImageFromURL('../assets/images/bob-pl-logo.PNG'),
  //       width: 100,
  //       height: 50,
  //       marginTop: 20,
  //       marginBottom: 20,
  //     },
  //     { text: one, style: 'point' },
  //     { text: two, style: 'point' },
  //     { text: three, style: 'point' },
  //     { text: four, style: 'point' },
  //     { text: five, style: 'point' },
  //     { text: six, style: 'point' },
  //     { text: seven, style: 'point' },
  //   ],
  //   styles: {
  //     point: {
  //       fontSize: 12,
  //       marginBottom: 5,
  //       alignment: 'justify',
  //     }
  //   }
  // };
  // pdfMake.createPdf(documentDefinition).download('basic-tnc.pdf');
  // }

  // getBase64ImageFromURL(url) {
  //   return new Promise((resolve, reject) => {
  //     const img = new Image();

  //     img.setAttribute('crossOrigin', 'annonymous');

  //     img.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       canvas.width = img.width;
  //       canvas.height = img.height;

  //       const ctx = canvas.getContext('2d');
  //       ctx.drawImage(img, 0, 0);

  //       const dataURL = canvas.toDataURL('image/png');

  //       resolve(dataURL);
  //     };
  //     img.onerror = error => {
  //       reject(error);
  //     };
  //     img.src = url;

  //   });
  // }

  checkBoxValid(val): void {
    if (val === true) {
      this.validCheckBox = true;
    } else {
      this.validCheckBox = false;
    }
  }

  checkBoxValidation() {
    if (this.tncForm.get('checkBox').invalid) {
      this.validCheckBox = false;
    }
    else {
      this.validCheckBox = true;
    }
  }

  goBack() {
    this.route.navigate(['/application-setup/approved-loans']);
  }

  onSubmit() {
    this.checkBoxValidation();
    if (this.tncForm.get('checkBox').valid) {
      this.spinner.show();
      this.genericService.submitBasicDetailsTnc({ basicDetailsTnc: true }).subscribe((data) => {
        this.spinner.hide();
        const screenDetails = { "screenNumber": 19, "screenName": "Basic TNC", "applicationId": this.applicationId, "product": "PL" }
        this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x });

        if (this.customerStatus.appliedLoanAmount <= this.customerStatus.preapprovedamt) { 
          this.route.navigate(['/application-setup/disbursal']);
        } else {
          this.route.navigate(["/application-setup/legal-heir"]);
        }
      }, err => {
        this.spinner.hide();
      })
    }
  }
} 
