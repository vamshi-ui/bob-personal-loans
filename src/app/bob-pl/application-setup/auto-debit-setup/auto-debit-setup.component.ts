import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WINDOW } from 'ngx-window-token';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

import { GenericService } from '../../../shared/services/generic.service';
import { EnachFailureDialogComponent } from './enach-failure/enach-failure-dialog.component';

@Component({
    selector: 'app-auto-debit-setup',
    templateUrl: './auto-debit-setup.component.html',
    styleUrls: ['./auto-debit-setup.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class AutoDebitSetupComponent implements OnInit {

    customerDetailss: any;
    saveCustomerScreenDetails: Object;
    autoDebitForm: FormGroup;

    @ViewChild('autoDebitFomRedirect', { static: false }) autoDebitFomRedirect: ElementRef;
    @ViewChild('mandateForm', { static: false }) mandateForm: ElementRef;

    _window: any;
    token: any;
    applicationId: any;

    dateOne: boolean;
    dateTwo: boolean;
    // dateThree: boolean;
    // dateFour: boolean;
    emiDate: any;

    bankAccounts: any;
    emiVal: string;
    emandateDetails: any;
    initiateResponse: any;
    needSetUp = false;
    selectedAccNo: any;
    accountHolder: any;

    constructor(@Inject(WINDOW) _window,
        public fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private genericService: GenericService,
        private spinner: NgxSpinnerService) {

        this.bankAccounts = new Array();
        this.form();
        this.getToken();
        this.emiDate = 4;
        this.dateOne = true;

        this.route.queryParams.subscribe(params => {
            if (params && params.status) {
                if (params.status.toLowerCase() == 'success') {
                    this.router.navigate(['/application-setup/auto-debit']);
                } else if (params.status.toLowerCase() == 'failure') {
                    this.dialog.open(EnachFailureDialogComponent);
                    this.getEmandateDetails();
                } else {
                    this.getEmandateDetails();
                }
            } else {
                this.getEmandateDetails();
            }
        });

    }

    ngOnInit(): void {
        this.getCustomerDetails();
    }

    getToken(): void {
        this.token = localStorage.getItem('token');
        this.applicationId = localStorage.getItem('applicationId');
    }

    form(): void {
        this.autoDebitForm = this.fb.group({
            bankAccount: ['', Validators.required],
            emiAmount: [{ value: '', disabled: true }],
            tenure: [{ value: '', disabled: true }]
        });
    }

    getCustomerDetails() {
        const customerDetails = {
            applicationId: this.applicationId
        };
        this.genericService.getCustomerStatus(customerDetails, this.token).subscribe(result => {
            this.customerDetailss = result;
            this.accountHolder = this.customerDetailss.accountHolder;
        });
    }

    getEmandateDetails(): void {
        this.spinner.show();
        let data = {
            applicationId: this.applicationId
        };

        this.genericService.getEmandateDetails(data, this.token).subscribe((resp: any) => {
            this.emandateDetails = resp;
            if (resp) {
                const screenDetails = { "screenNumber": 17, "screenName": "E mandate registration", "applicationId": this.applicationId, "product": "PL" }
                this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
                if (resp.bankAccounts && resp.bankAccounts.length) {
                    this.bankAccounts = resp.bankAccounts;
                    let i = 0;
                    this.needSetup(this.bankAccounts[i]);
                }

                this.autoDebitForm.patchValue(resp);
                // this.autoDebitForm.patchValue({
                //     bankAccount: resp.bankAccount,
                //     emiAmount: '56000',
                //     tenure: 12
                // })
            }
            this.spinner.hide();
        }, (error) => {
            this.spinner.hide();
        });

    }

    emiDates(dateValue): void {
        this.dateOne = false;
        this.dateTwo = false;
        // this.dateThree = false;
        // this.dateFour = false;

        if (dateValue == '04') {
            this.emiDate = 4;
            this.dateOne = true;
        } else if (dateValue == '10') {
            this.emiDate = 10;
            this.dateTwo = true;
        }
        // else if (dateValue == '16') {
        //     this.emiDate = 16;
        //     this.dateThree = true;
        // } else {
        //     this.emiDate = 24;
        //     this.dateFour = true;
        // }
    }

    back(): void {
        this.router.navigate(['/application-setup/e-contract']);
    }

    needSetup(value) {
        if (value && value.isBankofBaroda === "true") {
            this.needSetUp = false;
            this.selectedAccNo = value.accountNumber;
        } else {
            this.needSetUp = true;
            this.selectedAccNo = value.accountNumber;
        }
    }

    continueToNext() {
        if (this.autoDebitForm.invalid) {
            return;
        }
        let data = {
            applicationId: this.applicationId,
            emiDate: this.emiDate,
            bankAccount: this.selectedAccNo,
            tenure: this.autoDebitForm.get('tenure').value
        };

        this.genericService.mandateRegistration(data, this.token).subscribe((resp: any) => {
            const screenDetails = { "screenNumber": 17, "screenName": "E mandate registration", "applicationId": this.applicationId, "product": "PL" }
            this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
            this.router.navigate(['/application-setup/disbursal']);
            if (resp) {
                // this.initiateTransactionRequest();
            } else {
                this.spinner.hide();
            }
        }, (error) => {
            this.spinner.hide();
        });

    }

    setUp(): void {
        if (!this.autoDebitForm.valid) {
            return;
        }

        this.spinner.show();
        // let postData = this.autoDebitForm.getRawValue();
        // postData.applicationId = this.applicationId;
        // postData.emiDate = this.emiDate;
        // postData.bankAccounts = this.bankAccounts;
        // console.log(postData)

        let data = {
            applicationId: this.applicationId,
            emiDate: this.emiDate,
            bankAccount: this.selectedAccNo,
            tenure: this.autoDebitForm.get('tenure').value,
        };

        this.genericService.mandateRegistration(data, this.token).subscribe((resp: any) => {
            const screenDetails = { "screenNumber": 17, "screenName": "E mandate registration", "applicationId": this.applicationId, "product": "PL" }
            this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
            this.router.navigate(['/application-setup/disbursal']);
            if (resp) {
                this.initiateTransactionRequest();
            } else {
                this.spinner.hide();
            }
        }, (error) => {
            this.spinner.hide();
        });
    }

    initiateTransactionRequest(): void {
        let data = {
            appId: this.applicationId
        };
        this.spinner.hide();
        this.genericService.initiateTransactionRequest(data, this.token).subscribe((resp: any) => {
            if (resp && resp.serviceURL) {
                this.initiateResponse = resp.serviceURL;
                // window.open(resp.serviceURL, "_self");
                setTimeout(() => {
                    this.mandateForm.nativeElement.submit();
                }, 1000)
                this.spinner.hide();
            } else {
                this.spinner.hide();
            }
        }, (error) => {
            this.spinner.hide();
        });
    }

    ngOnDestroy(): void {
        this.dialog.closeAll();
    }

}
