import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

import { ValidatorService } from '../../../shared/validations/validator.service';
import { GenericService } from '../../../shared/services/generic.service';
import { DocumentsService } from '../../../shared/services/documents-service';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-upload-bank-statement',
    templateUrl: './upload-bank-statement.component.html',
    styleUrls: ['./upload-bank-statement.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class UploadBankStatementComponent implements OnInit {

    saveCustomerScreenDetails: Object;
    CurrentmonthName: string;
    CurrentYear: number;
    previousYear: number;
    previousYearMonth: any;
    uploadForm: FormGroup;
    notFileName = true;
    FirstFile: File | null;
    formVisible: any = true;
    Filepush: any = [];
    checked: any;
    closeVisible = false;
    uploadFormatError: boolean;
    password: any = '';
    FilepushArray: any = [];
    applicationId: string;
    appID: string;
    token: string;
    fileDocumentPush: any = [];
    base64format: any = [];
    uploadedFile: Object;
    bsmetadata: any;
    inputFile: any;
    isFile: boolean;
    hide = true;
    visibility = 'visibility_off'
    text: any = 'password';
    uploadFromDate: any;
    uploadToDate: any;
    customerDetails: any;
    uploadStatementError: boolean;
    statementLoader: boolean;
    validPrimaryAcc: boolean = false;
    accDtls: any;
    saveaccDtls: any;
    perfiosId: boolean;

    constructor(private fb: FormBuilder,
        public validator: ValidatorService,
        private service: ComponentInteractionService,
        public route: Router,
        public docService: DocumentsService,
        private genericService: GenericService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService) {

        this.uploadFromDate = moment().subtract(12, 'months').format('MMM YYYY');
        this.uploadToDate = moment().subtract(1, 'months').format('MMM YYYY');
        this.statementLoader = false;

        this.saveaccDtls = { accNo: '' };
        this.perfiosId = false;
        this.accDtls = '';
    }

    ngOnInit() {
        this.form();
        this.getCacheData();
    }

    form() {
        this.uploadForm = this.fb.group({
            password: '',
            file: '',
            accountType: ['']
        });
    }

    getCacheData() {
        this.applicationId = localStorage.getItem('applicationId');
        this.appID = localStorage.getItem('AID');
        this.token = localStorage.getItem('token');
        this.getCustomerDetails();
        this.getPerfiosTransAccountDtls();
    }

    getCustomerDetails() {
        const customerDetails = {
            applicationId: this.applicationId
        };
        this.genericService.getCustomerStatus(customerDetails, this.token).subscribe(result => {
            this.customerDetails = result;
        });
    }

    hidePasswordFunction(id) {
        if (this.FilepushArray[id].text == 'password') {
            this.FilepushArray[id].text = 'text';
            this.FilepushArray[id].visibility = 'visibility';

        }
    }

    hidetextFunction(id) {
        if (this.FilepushArray[id].text == 'text') {
            this.FilepushArray[id].text = 'password';
            this.FilepushArray[id].visibility = 'visibility_off';
        }
    }

    handleFileInputOne(file) {
        if (this.statementLoader) {
            return;
        }
        this.statementLoader = true;
        this.fileDocumentPush = [];

        const files = file.target.files;
        let fileName = files[0].name;

        if (files && files[0].type == "application/pdf") {
            this.uploadFormatError = false;
            let fromDate = moment().subtract(12, 'months').format('YYYY-MM');
            let toDate = moment().subtract(1, 'months').format('YYYY-MM');

            this.fileDocumentPush.push({
                "fileName": files[0].name,
                "password": this.password,
            })

            const bsmetadata = {
                appId: this.applicationId,
                fileType: "pdf",
                fromDate: fromDate,
                toDate: toDate,
                fileDetails: this.fileDocumentPush,
                institutionId: "",
            };
            this.spinner.show();

            this.docService.uploadFile(files.item(0), bsmetadata, this.token).subscribe((resp: any) => {
                if (resp && resp.status && resp.status.statusMessage && resp.status.statusMessage.toLowerCase() == 'success') {
                    this.FirstFile = files.item(0);
                    this.isFile = false;
                    this.Filepush.push(this.FirstFile)
                    this.formVisible = false;
                    this.closeVisible = true;
                    this.FilepushArray.push({ file: this.FirstFile, password: this.password, text: this.text, visibility: this.visibility });
                    this.getPerfiosTransAccountDtls();
                } else {
                    file.target.value = '';
                    this.toastr.error('Please upload a valid Bank Statement', '', { timeOut: 2000 })
                }
                this.spinner.hide();
                this.statementLoader = false;
            }, (error) => {
                this.spinner.hide();
                this.statementLoader = false;
                file.target.value = '';
                this.toastr.error('Please upload a valid Bank Statement', '', { timeOut: 2000 })
            });
        }
        else {
            this.toastr.error('File Format must be PDF', '', { timeOut: 2000 });
            file.target.value = '';

            this.isFile = true;
            this.statementLoader = false;
        }
    }


    addItem() {
        this.formVisible = true;
        // this.FilepushArray.push({ file: this.FirstFile, password: this.password });
        // console.log(this.FilepushArray)
        this.password = '';
    }

    passwordInput(val, i) {
        this.FilepushArray[i].password = val;
    }

    passwordfile(val) {
        this.password = val;
    }

    removeFirstFile(index) {
        this.FilepushArray.splice(index, 1);
        if (this.FilepushArray.length === 0) {
            this.formVisible = true;
            // this.uploadForm.get('password').disable();
            this.closeVisible = false;
        } else {
            this.formVisible = false;
        }
    }

    HideForm() {
        this.formVisible = false;
        this.uploadFormatError = false;
    }

    getPerfiosTransAccountDtls() {

        this.spinner.show();
        let customerDetails = {
            applicationId: this.applicationId,
            id: this.perfiosId
        };
        this.genericService.getPerfiosTransAccountDtls(customerDetails, this.token).subscribe((resp: any) => {
            if (resp.status.toLowerCase() == 'success') {
                this.accDtls = '';

                if (resp.accDtls && resp.accDtls.length) {
                    this.uploadForm.get('accountType').reset();
                    this.accDtls = new Array();
                    resp.accDtls.forEach((item: any) => {
                        if (resp.accDtls.length == 1) {
                            item.primaryAcc = true;
                            this.saveaccDtls.accNo = item.accountNo;
                            this.validPrimaryAcc = true;

                        }
                        else {
                            this.validPrimaryAcc = false;
                        }
                        this.accDtls.push(item);
                        if (item.primaryAcc) {
                            this.saveaccDtls.accNo = item.accountNo;
                        }
                    });
                }
            }
            this.spinner.hide();
            // console.log(this.saveaccDtls)
        }, (error) => {
            this.spinner.hide();
        })
    }

    saveAccountdetails(data, index) {
        this.saveaccDtls.accNo = data.accountNo;

        for (let i = 0; i < this.accDtls.length; i++) {
            if (i == index) {
                this.accDtls[i].primaryAcc = true;
                this.validPrimaryAcc = true;
            }
            else {
                this.accDtls[i].primaryAcc = false;
                this.validPrimaryAcc = true;
            }
        }
    }


    goBack() {
        this.route.navigate(['/application-setup/provide-bank-statements']);
    }

    onSubmit() {

        // if (this.uploadForm.get('file').value === '') {
        if (!this.accDtls) {
            this.toastr.error('Please Upload Bank Statement', '', { timeOut: 4000 });
            return;
        } else if (this.saveaccDtls && this.saveaccDtls.accNo === '' || !this.validPrimaryAcc) {
            this.toastr.error('Please select your Primary Account', '', { timeOut: 4000 });
            return;
        } else {
            this.formVisible = false;
        }
        // }

        if (!this.formVisible) {
            const screenDetails = { "screenNumber": 11, "screenName": "Upload bank statements", "applicationId": this.applicationId, "product": "PL" }
            this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
            if (this.customerDetails) {
                this.spinner.show();

                let data = {
                    accNo: this.saveaccDtls.accNo,
                    applicationId: this.applicationId

                }
                this.genericService.savePerfiosPrimaryAccountDtls(data, this.token).subscribe((resp: any) => {
                    if (resp.status.toLowerCase() == 'success') {
                        this.spinner.hide();

                        if (this.customerDetails.jobType === 'Salaried') {
                            this.route.navigate(['/application-setup/utility-bill']);
                            return;
                        } else {
                            this.route.navigate(['/application-setup/provide-itr-statements']);
                            return;
                        }
                    }

                }, (error) => {
                    this.spinner.hide();
                })
            }
        } else {
            this.toastr.error('Please Upload Bank Statement', '', { timeOut: 2000 });
        }




        // if (this.formVisible == false) {
        //     this.fileDocumentPush = [];
        //     this.base64format = [];

        //     for (let k = 0; k < this.FilepushArray.length; k++) {
        //         const reader = new FileReader();
        //         reader.readAsDataURL(this.FilepushArray[k].file);
        //         reader.onload = () => {

        //             for (var i = 0; i < this.FilepushArray.length; i++) {
        //                 this.fileDocumentPush.push({
        //                     "fileName": this.FilepushArray[i].file.name,
        //                     "password": this.FilepushArray[i].password,
        //                 })
        //                 this.base64format.push(reader.result);
        //             }

        //             let fromDate = moment().subtract(13, 'months').format('YYYY-MM');
        //             let toDate = moment().subtract(2, 'months').format('YYYY-MM');

        //             const bsmetadata = {
        //                 appId: this.applicationId,
        //                 fileType: "pdf",
        //                 fromDate: fromDate,
        //                 toDate: toDate,
        //                 fileDetails: this.fileDocumentPush,
        //                 institutionId: "",
        //             };

        //             const inputFile = this.base64format;

        //             this.genericService.uploadBankStatements(bsmetadata, inputFile, this.token).subscribe((x) => {
        //                 if (this.customerDetails) {
        //                     if (this.customerDetails.jobType === 'Salaried') {
        //                         this.route.navigate(['/application-setup/utility-bill']);
        //                         return;
        //                     } else {
        //                         this.route.navigate(['/application-setup/provide-itr-statements']);
        //                         return;
        //                     }
        //                 }
        //             });
        //         }
        //         break;
        //     }
        // } else {
        //     return;
        // }
    }

}
