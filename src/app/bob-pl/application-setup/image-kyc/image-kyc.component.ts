import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { GenericService } from 'src/app/shared/services/generic.service';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
// import { truncateSync } from 'fs';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-image-kyc',
  templateUrl: './image-kyc.component.html',
  styleUrls: ['./image-kyc.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImageKycComponent {

  saveCustomerScreenDetails: Object;
  accountHolder: any;
  approvalLoan: string;
  getResponse: any;
  uploadResponse: any;
  token: any;
  appId: any;
  appPackId: any;
  outputFile: any;
  imageFile: any;
  loanAmount: any;
  customerStatus: any;
  previewImage: any;

  constructor(private genericService: GenericService,
    private router: Router,
    public spinner: NgxSpinnerService,
    public _DomSanitizer: DomSanitizer,
    private toastr: ToastrService,
    public service: ComponentInteractionService) { }

  public showWebcam = false;
  public sampleImage = true;
  public uploadStatus = false;
  public errors: WebcamInitError[] = [];
  public webcamImage: WebcamImage = null;

  private trigger: Subject<void> = new Subject<void>();

  ngOnInit() {
    this.getToken();
    this.getCustomerStatus();
    this.getCustomerSelfie();
  }

  getToken(): void {
    this.token = localStorage.getItem('token');
    this.appId = localStorage.getItem('applicationId');
    this.appPackId = localStorage.getItem('appPackId');
  }

  getCustomerStatus() {
    const payload = {
      applicationId: this.appId
    }
    this.genericService.getCustomerStatus(payload, this.token).subscribe(result => {
      this.customerStatus = result;
      this.loanAmount = parseInt(this.customerStatus.sanctionLoanAmount);
      this.accountHolder = this.customerStatus.accountHolder;
    });
  }

  getCustomerSelfie() {
    const payload = {
      applicationId: this.appId
    }
    this.spinner.show();
    this.genericService.getSelfie(payload, this.token).subscribe((result) => {
      this.spinner.hide();
      if (result) {
        this.sampleImage = false;
        this.showWebcam = false;
        this.previewImage = 'data:image/jpeg;base64,' + result;
      }
    }, err => {
      this.spinner.hide();
    });
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.previewImage = this.webcamImage.imageAsDataUrl;
    this.showWebcam = !this.showWebcam;
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
    this.sampleImage = !this.showWebcam;
    this.webcamImage = null;
    this.previewImage = null;
    this.uploadStatus = false;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
    if (this.errors.length === 1) {
      this.toastr.error('Camera not found', '', { timeOut: 4000 });
      setTimeout(() => {
        this.toastr.clear();
        this.errors = [];
      }, 4000);
    }
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  async convertToFile(imageData) {

    const rawData = atob(imageData);
    const bytes = new Array(rawData.length);
    for (let x = 0; x < rawData.length; x++) {
      bytes[x] = rawData.charCodeAt(x);
    }
    const arr = new Uint8Array(bytes);
    await this.convertToBlob(arr).then((result: Blob) => {
      this.outputFile = new File([result], `${new Date().getTime()}.jpeg`,
        { type: 'image/jpeg', lastModified: Date.now() });
    });
    return this.outputFile;
  }

  convertToBlob(arr) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([arr], { type: 'image/jpeg' });
      resolve(blob);
    });
  }

  back() {
    this.router.navigate(['/application-setup/legal-heir']);
  }

  public uploadImage(): void {
    this.uploadStatus = true;
    // var base64 = this.webcamImage.imageAsDataUrl.substring(23);
    var base64 = this.webcamImage.imageAsDataUrl.split('data:image/jpeg;base64,');

    this.convertToFile(base64[1]).then(value => {
      this.imageFile = value;
      this.spinner.show();

      this.genericService.uploadSelfie(value, this.appId, this.token).subscribe(result => {
        this.spinner.hide();
        this.uploadResponse = result;
      }, err => {
        this.spinner.hide();
      });
    });
  }

  continue() {
    this.uploadImage();
    const screenDetails = { "screenNumber": 21, "screenName": "Image KYC", "applicationId": this.appId, "product": "PL" }
    this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })

    if (this.accountHolder === "No" && this.loanAmount <= 60000) {
      if (this.customerStatus.kycStatus === false || this.customerStatus.kycStatus === null) {
        this.router.navigate(['/application-setup/e-kyc']);
      } else {
        this.router.navigate(['/application-setup/e-contract']);
      }
    } else if (this.accountHolder === "Yes" && this.loanAmount <= 60000) {
      if (this.customerStatus) {
        if (this.customerStatus.kycStatus === false || this.customerStatus.kycStatus === null) {
          this.router.navigate(['/application-setup/e-kyc']);
        } else {
          this.router.navigate(['/application-setup/e-contract']);
        }
      }
    }
    else {
      if (this.accountHolder === "No") {
        this.router.navigate(['/application-setup/video-kyc']);
      } else {
        if (this.customerStatus.kycStatus === false || this.customerStatus.kycStatus === null) {
          this.router.navigate(['/application-setup/video-kyc']);
        } else {
          this.router.navigate(['/application-setup/e-contract']);
        }
      }
    }
  }
}
