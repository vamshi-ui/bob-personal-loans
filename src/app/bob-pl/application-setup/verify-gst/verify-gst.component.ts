import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

import { ValidatorService } from '../../../shared/validations/validator.service';
import { GenericService } from '../../../shared/services/generic.service';
import { DocumentsService } from '../../../shared/services/documents-service';

import { ResendOtpDialogComponent } from '../../resend-otp-dialog/resend-otp-dialog.component';

@Component({
    selector: 'app-verify-gst',
    templateUrl: './verify-gst.component.html',
    styleUrls: ['./verify-gst.component.scss'],
})

export class VerifyGSTComponent implements OnInit {

    userName: boolean;
    saveCustomerScreenDetails: Object;
    enterOtp = false;
    public countDown: Subscription;
    public counter: any = -1;
    public EnteredNumber: number;
    public aadharText = false;
    borrowerForm: FormGroup;
    valid;
    message = '';
    otpBtnAction: boolean;
    invalidOtp: boolean;
    uploadOne: boolean;
    uploadTwo: boolean = true;
    FirstFile: any;
    FilepushArray: any = [];
    formVisible: boolean;
    closeVisible: boolean;
    base64format: any = [];
    fileDocumentPush: any = [];
    validateFile: boolean;
    isFile: boolean;
    fileClose: boolean;
    hideOtp: boolean;
    uploadFiles: FormGroup;
    variable = false;
    variableOne: boolean;
    variableTwo: boolean;

    applicationID: string;
    token: string;

    gstReport: any;
    gstDetails: any;
    uploadFromDate: any;
    uploadToDate: any;
    btnCounter = 0;
    gstDown: boolean;
    gstOtpError: any;
    gstOtpDown: boolean;
    gstInvalidOtpError: any;
    uploadStatementError: boolean;
    getOtpLoader: boolean;
    validateOtpLoader: boolean;
    gstUploadLoader: boolean;
    dataLoader: boolean;
    hideOtpValue = true;
    dialog: any;
    itrStatus = false;


    constructor(private formBuilder: FormBuilder,
        private validator: ValidatorService,
        private route: Router,
        private genericService: GenericService,
        public docService: DocumentsService,
        private dialogRef: MatDialog,
        private spinner: NgxSpinnerService) {

        this.uploadFromDate = moment().subtract(12, 'months').format('MMM YYYY');
        this.uploadToDate = moment().subtract(1, 'months').format('MMM YYYY');
        this.gstDown = false;
        this.gstOtpError = '';
        this.gstOtpDown = false;
        this.gstInvalidOtpError = '';
        this.uploadStatementError = false;
        this.getOtpLoader = false;
        this.validateOtpLoader = false;
        this.gstUploadLoader = false;
        this.dataLoader = true;

    }

    ngOnInit() {
        this.borrowerDetailsForm();
        // this.uploadFilesForm();
        this.getCachedData();
        this.getGstinDetails();
        // this.onChanges();
    }

    getGstinDetails() {
        this.spinner.show();
        let data = {
            appId: this.applicationID
        };

        this.genericService.getGstinDetails(data, this.token).subscribe((resp: any) => {
            this.gstDetails = resp;
            console.log(this.gstDetails);
            if (resp && resp.itrResponse && resp.itrResponse.gstinsResponse) {
                this.gstDetails = resp.itrResponse.gstinsResponse;
                // this.getCustomerDetails();
            } else {
                // this.route.navigate(['/application-setup', 'utility-bill']);
                // this.dialog.close();
            }
            this.spinner.hide();
            this.dataLoader = false;
        }, (error) => {
            this.spinner.hide();
            this.dataLoader = false;
        });
    }

    getGstUser(gstDetail) {
        if (gstDetail != null) {
            this.userName = true;
            this.borrowerForm.get('username').patchValue(gstDetail.tradeName);
        }
        else {
            this.userName = false;
        }
    }

    getCachedData() {
        this.applicationID = localStorage.getItem('applicationId');
        this.token = localStorage.getItem('token');
        // this.getCustomerDetails();
        // this.getItrStatus();
    }

    @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;

    // getCustomerDetails() {
    //     this.dialog = this.dialogRef.open(this.myDialog, { disableClose: true });
    // }

    // getItrStatus() {
    //     let postdata = {
    //         applicationId: this.applicationID
    //     };
    //     this.spinner.show();
    //     this.genericService.getPerfiosStatus(postdata, this.token).subscribe((resp: any) => {
    //         if (resp) {
    //             if (resp.action.toLowerCase() == 'success') {
    //                 this.spinner.hide();
    //                 this.itrStatus = true;
    //             } else {
    //                 this.itrStatus = false;
    //             }
    //         }
    //     }, (error) => {
    //         this.spinner.hide();
    //     });
    // }

    borrowerDetailsForm() {
        this.borrowerForm = this.formBuilder.group({
            selectGstNo: ['', Validators.required],
            username: ['', Validators.required],
            otp1: this.validator.valid.prefix,
            loginUpload: ['', Validators.required],
            upload: this.validator.valid.prefix
        });
    }

    // uploadFilesForm() {
    //     this.uploadFiles = this.formBuilder.group({
    //         upload: this.validator.valid.prefix
    //     })
    // }

    onChanges() {
        this.borrowerForm.get('selectGstNo').valueChanges.subscribe(value => {
            if (value) {
                this.borrowerForm.get('loginUpload').enable({ emitEvent: false });
                this.borrowerForm.get('username').enable({ emitEvent: false });
            }
        });
    }

    showType(event) {
        if (event.value === 'Yes') {
            this.aadharText = false;
            this.borrowerForm.patchValue({ verifiedBy: 'Account Number associated' });
        } else if (event.value === 'No') {
            this.aadharText = true;
            this.borrowerForm.patchValue({ verifiedBy: 'Aadhaar Number' });
        }
    }

    openOtp() {
        if (this.getOtpLoader) {
            return;
        }
        this.getOtpLoader = true;
        this.gstDown = false;
        this.gstOtpError = '';
        this.gstOtpDown = false;

        this.btnCounter += 1;
        if (this.btnCounter > 2) {
            this.getOtpLoader = false;
            this.counter = 0;
            this.dialogRef.open(ResendOtpDialogComponent, { disableClose: true });
        }
        else {
            this.borrowerForm.get('otp1').reset();
            let data = {
                gstin: this.borrowerForm.get('selectGstNo').value,
                username: this.borrowerForm.get('username').value,
                appId: this.applicationID
            };
            this.spinner.show();

            this.genericService.getGstOtp(data, this.token).subscribe((resp: any) => {
                if (resp && resp.status && resp.status.statusMessage && resp.status.statusMessage.toLowerCase() == 'success') {
                    if (this.counter === 0 || this.counter < 0) {
                        this.enterOtp = true;
                        this.givenTime(29);
                    }
                } else {
                    if (resp && resp.status && resp.status.statusMessage) {
                        this.gstOtpError = resp.status.statusMessage;
                        this.gstDown = true;
                    } else {
                        this.gstDown = true;
                    }
                }
                this.spinner.hide();
                this.getOtpLoader = false;
            }, (error) => {
                this.spinner.hide();
                this.getOtpLoader = false;
                this.gstDown = true;
            });
        }
    }

    handleFileInputOne(file) {
        if (this.gstUploadLoader) {
            return;
        }
        this.gstUploadLoader = true;
        this.uploadStatementError = false;
        this.fileDocumentPush = [];

        const files = file.target.files;
        let fileName = files[0].name;

        if (files && files[0].type == "application/pdf") {
            this.isFile = false;
            this.fileDocumentPush.push({
                "fileName": fileName
            })

            let fromDate = moment().subtract(13, 'months').format('MMYYYY');
            let toDate = moment().subtract(2, 'months').format('MMYYYY');

            const gstmetadata = {
                appId: this.applicationID,
                gstNumber: this.borrowerForm.get('selectGstNo').value,
                fileType: "pdf",
                fileDetails: this.fileDocumentPush,
                fromDate: fromDate,
                toDate: toDate
            };
            this.spinner.show();

            this.docService.uploadGstFile(files.item(0), gstmetadata, this.token).subscribe((resp: any) => {
                if (resp && resp.status && resp.status.statusMessage && resp.status.statusMessage.toLowerCase() == 'success') {
                    this.FirstFile = files[0];
                    this.FilepushArray.push({ file: this.FirstFile });

                    if (this.FilepushArray.length > 1 || this.FilepushArray.length == 1) {
                        this.validateFile = false;
                    }
                } else {
                    file.target.value = '';
                    this.uploadStatementError = true;
                }
                this.spinner.hide();
                this.gstUploadLoader = false;
            }, (error) => {
                this.spinner.hide();
                this.gstUploadLoader = false;
                this.uploadStatementError = true;
                file.target.value = '';
            });
        } else {
            file.target.value = '';
            this.gstUploadLoader = false;
            this.isFile = true;
        }
    }

    remove(index) {
        this.FilepushArray.splice(index, 1);
        if (this.FilepushArray.length === 0) {
            this.validateFile = true;
        }
        else {
            this.validateFile = false;
        }
    }

    changeRadio(event) {
        if (event.value == 'login') {
            this.uploadTwo = true;
            this.variable = true;
            this.variableTwo = true;
            this.variableOne = false;
            this.hideOtp = false;
            this.borrowerForm.get('upload').reset();
            this.borrowerForm.get('upload').disable();
            this.borrowerForm.get('selectGstNo').reset();
            this.borrowerForm.get('selectGstNo').enable();
            this.borrowerForm.get('username').enable();
            // this.borrowerForm.get('selectGstNo').reset();
            // this.borrowerForm.get('username').reset();
            if (!this.enterOtp) {
                this.otpBtnAction = false;
            } else {
                this.otpBtnAction = true;
            }

            if (this.borrowerForm.get('username').valid && this.borrowerForm.get('selectGstNo').valid) {
                // this.counter = 60;
                // this.givenTime(60);
                this.variable = false;
                this.variableOne = true;
                this.variableTwo = false;
            }
        }
        else {
            this.uploadTwo = false;
            this.counter = 0;
            this.variable = true;
            this.variableTwo = false;
            this.counter = 0;
            this.hideOtp = true;
            this.otpBtnAction = false;
            // this.borrowerForm.get('selectGstNo').disable();
            this.borrowerForm.get('username').disable();
            this.borrowerForm.get('selectGstNo').reset();
            this.borrowerForm.get('username').reset();
            this.borrowerForm.get('upload').enable();

        }
    }

    getOtp(event) {
        this.borrowerForm.get('selectGstNo').markAsTouched();
        this.borrowerForm.get('username').markAsTouched();
        if (!this.borrowerForm.get('selectGstNo').valid || !this.borrowerForm.get('username').valid
            || !this.borrowerForm.get('loginUpload').valid) {
            this.variable = false;
            this.variableOne = false;
            return;
        }

        if (this.getOtpLoader) {
            return;
        }
        this.getOtpLoader = true;
        this.gstDown = false;
        this.gstOtpError = '';

        let data = {
            gstin: this.borrowerForm.get('selectGstNo').value,
            username: this.borrowerForm.get('username').value,
            appId: this.applicationID
        };
        this.spinner.show();

        this.genericService.getGstOtp(data, this.token).subscribe((resp: any) => {
            if (resp && resp.status && resp.status.statusMessage && resp.status.statusMessage.toLowerCase() == 'success') {

                if (this.counter === 0 || this.counter < 0) {
                    this.enterOtp = true;
                    this.otpBtnAction = true;
                    this.givenTime(59);
                    this.variableOne = true;
                }
            } else {
                if (resp && resp.status && resp.status.statusMessage) {
                    this.gstOtpError = resp.status.statusMessage;
                    this.gstDown = true;
                } else {
                    this.gstDown = true;
                }
            }
            this.spinner.hide();
            this.getOtpLoader = false;
            this.borrowerForm.get('otp1').reset();
        }, (error) => {
            this.spinner.hide();
            this.getOtpLoader = false;
            this.gstDown = true;
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

    alphaSpaceOnly(event): boolean {
        const inputValue = event.which;
        // allow letters and whitespaces only.
        if (!(inputValue >= 65 && inputValue <= 120) && (inputValue !== 32 && inputValue !== 0)) {
            return false;
        }
        return true;
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

    restrictNumbers(event): boolean {
        const inp = String.fromCharCode(event.keyCode);

        if (/[a-zA-Z.']/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    cancel() {
        this.uploadTwo = true;
        this.variable = true;
        this.variableTwo = true;
        this.variableOne = false;
        this.hideOtp = false;
        this.otpBtnAction = false;
        this.borrowerForm.get('loginUpload').patchValue("login");
    }

    proceed() {
        this.borrowerForm.get('selectGstNo').markAsTouched();
        this.borrowerForm.get('upload').markAsTouched();
        if (this.borrowerForm.get('selectGstNo').valid && this.borrowerForm.get('upload').valid) {
            this.route.navigate(['/application-setup', 'utility-bill']);
            return;
        } else {
            return;
        }

        /*this.fileDocumentPush = [];
        this.base64format = [];

        if (!this.validateFile) {
            for (let k = 0; k < this.FilepushArray.length; k++) {
                const reader = new FileReader();

                reader.readAsDataURL(this.FilepushArray[k].file);
                reader.onload = () => {
                    for (var i = 0; i < this.FilepushArray.length; i++) {
                        this.fileDocumentPush.push({
                            "fileName": this.FilepushArray[i].file.name
                        })
                        this.base64format.push(reader.result);
                    }

                    let fromDate = moment().subtract(13, 'months').format('MMYYYY');
                    let toDate = moment().subtract(2, 'months').format('MMYYYY');

                    const gstmetadata = {
                        appId: this.applicationID,
                        gstNumber: this.borrowerForm.get('selectGstNo').value,
                        fileType: "pdf",
                        fileDetails: this.fileDocumentPush,
                        fromDate: fromDate,
                        toDate: toDate
                    };
                    const inputFile = this.base64format;

                    this.genericService.gstUploadStatement(gstmetadata, inputFile, this.token).subscribe((x) => {
                        this.route.navigate(['/application-setup', 'utility-bill']);
                    });
                }
                break;
            }
        }*/
    }

    validateOtp() {
        const screenDetails = { "screenNumber": 14, "screenName": "Verify GST", "applicationId": this.applicationID, "product": "PL" }
        this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
        if (this.validateOtpLoader || !this.borrowerForm.valid) {
            return;
        }

        this.validateOtpLoader = true;
        this.gstOtpDown = false;
        this.gstInvalidOtpError = '';

        let data = {
            gstin: this.borrowerForm.get('selectGstNo').value,
            username: this.borrowerForm.get('username').value,
            appId: this.applicationID,
            otp: this.borrowerForm.get('otp1').value
        };
        this.spinner.show();

        this.genericService.validateGstOtp(data, this.token).subscribe((resp: any) => {
            if (resp && resp.status && resp.status.statusMessage && resp.status.statusMessage.toLowerCase() == 'success') {
                this.route.navigate(['/application-setup', 'utility-bill']);
            } else {
                if (resp && resp.status && resp.status.statusMessage) {
                    this.gstInvalidOtpError = resp.status.statusMessage;
                    this.gstOtpDown = true;
                } else {
                    this.gstOtpDown = true;
                }
            }
            this.spinner.hide();
            this.validateOtpLoader = false;
        }, (error) => {
            this.spinner.hide();
            this.validateOtpLoader = false;
            this.gstOtpDown = true;
        });
    }

}
