import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericService } from 'src/app/shared/services/generic.service';
import { ValidatorService } from 'src/app/shared/validations/validator.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-utility-bill-details',
    templateUrl: './utility-bill-details.component.html',
    styleUrls: ['./utility-bill-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UtilityBillDetailsComponent implements OnInit {

    proceed: boolean;
    stateSelections: boolean;
    stateSelection: boolean;
    displayId: boolean;
    stateLkps: any;
    saveCustomerScreenDetails: Object;
    enable: boolean;
    mode: any;
    electricityProvider: any;
    utilitydisabled = false;
    token: any;
    stateLkp: any;
    utilityProviderNameLkp: any;
    utilityProviderTypeLkp: any;
    applicationId: any
    public utilityForm: FormGroup;
    resp: any;
    invalidIdNumber: boolean;
    utilityProviderTypeHide = false;

    constructor(private fb: FormBuilder,
        private validator: ValidatorService,
        private genericService: GenericService,
        private route: Router,
        private toaster: ToastrService,
        private spinner: NgxSpinnerService) {
    }

    ngOnInit(): void {
        this.utilityBillForm();
        this.getToken();
        this.getUtilityBillDetails();
        this.getLookUpValues();
        this.makeBRECall();
        this.verifyIdNumber();
    }

    getToken(): void {
        this.token = localStorage.getItem('token');
        this.applicationId = localStorage.getItem('applicationId');
    }

    getUtilityBillDetails(): void {
        this.spinner.show();
        let data = {
            applicationId: this.applicationId
        };
        this.genericService.getUtilityBillDetails(data, this.token).subscribe((resp) => {
            if (resp) {
                this.utilityForm.patchValue(resp);
            }
            this.spinner.hide();
        }, (error) => {
            this.spinner.hide();
        });
    }

    makeBRECall(): void {
        const data =
            {
                applicationId: this.applicationId,
            };
        this.genericService.uplaodUtilityBill(data, this.token).subscribe((x) => {
            this.resp = x;
        });
    }

    getLookUpValues(): void {
        const salutation = {
            lookupName: 'UTILITY STATE LOOKUP'
        };
        this.genericService.getLookUpValues(salutation, this.token).subscribe(result => {
            this.stateLkp = result;
        });

        const gender = {
            lookupName: 'UTILITY PROVIDER TYPE'
        };
        this.genericService.getLookUpValues(gender, this.token).subscribe(result => {
            this.utilityProviderTypeLkp = result;
        });

        const jobType = {
            lookupName: 'UTILITY PROVIDER NAME'
        }
        this.genericService.getLookUpValues(jobType, this.token).subscribe(result => {
            this.utilityProviderNameLkp = result;
        });
    }

    disableutiltyProvide(value): void {
        this.utilityForm.get('utilityName').reset();
        this.utilityForm.get('idNumber').reset();
        this.enable = false;
        // this.utilitydisabled = false;
        this.displayId = false;
        this.stateSelections = false;
        this.mode = value.toLowerCase();

        if (value === "Electricity") {
            this.utilityForm.get('utilityName').enable();
            this.utilitydisabled = true;
            this.displayId = true;
        } else {
            this.utilityForm.get('utilityName').disable();
            this.utilityForm.get('utilityType').disable();
            this.utilityForm.get('idNumber').disable();
            this.utilitydisabled = false;
            this.displayId = true;
            this.stateSelections = true
        }
    }

    utilityBillForm(): void {
        this.utilityForm = this.fb.group({
            state: this.validator.valid.prefix,
            utilityType: this.validator.valid.prefix,
            utilityName: this.validator.valid.prefix,
            idNumber: this.validator.valid.idNumber
        });
    }

    utilityName(value): void {
        this.utilityForm.get('idNumber').reset();
        if (value === null) {
            this.stateSelections = true;
        } else {
            this.stateSelections = true;
            this.electricityProvider = value
        }
    }

    IdNumberValueChanges(): void {
        this.utilityForm.get('idNumber').valueChanges.subscribe((val) => {

            if (val === null || val === '') {
                this.enable = false;

            } else {
                if (val.match(/^(\w)\1+$/g)) {
                    this.invalidIdNumber = true;
                } else {
                    this.invalidIdNumber = false;
                }
            }
        });
    }

    verifyIdNumber(): void {
        this.IdNumberValueChanges();
        if (this.utilityForm.get('idNumber').valid && this.utilityForm.get('idNumber').value !== null) {
            if (this.utilityForm.get('idNumber').value.length >= 5 && !this.utilityForm.get('idNumber').value.match(/^(\w)\1+$/g)) {
                this.invalidIdNumber = false;
                const payload = {
                    transactionCompleteUrl: "https://www.example.com/transactionCompleteUrl",
                    consumerNo: this.utilityForm.value.idNumber,
                    electricityProvider: this.electricityProvider,
                    redirectUrl: "https://www.example.com/",
                    mode: this.mode,
                    applicationId: parseInt(this.applicationId)
                }
                this.spinner.show();
                this.genericService.validUtility(payload, this.token).subscribe((result) => {
                    this.enable = true;
                    this.proceed = true;
                    this.spinner.hide();

                }, (error) => {
                    this.enable = false;
                    this.proceed = false;
                    this.spinner.hide();
                    this.toaster.error('Identifier Number is invalid')
                });
            } else {
                this.invalidIdNumber = true;
                this.enable = false;
            }
        } else {
            this.enable = false;
        }
    }

    stateSelction(value): void {
        this.toaster.clear();
        this.utilityForm.get('utilityType').markAsUntouched();
        if (value) {
            this.utilityForm.get('utilityType').reset();
            this.utilityForm.get('utilityName').reset();
            this.utilityForm.get('idNumber').reset();
            this.enable = false;
            this.utilitydisabled = false;
            this.displayId = false;
        }
        const activity = { 'lookupTypeId': value }
        this.genericService.getLookupChildValues(activity, this.token).subscribe((result: any) => {

            if (result.length !== 0) {
                this.stateSelection = true;
                this.stateLkps = result;
                this.utilityProviderTypeHide = true;
                this.utilityForm.get('utilityType').enable();
            } else {
                this.toaster.error("The selected state doesn't have electricity service provider.Kindly proceed to next screen");
                this.utilityProviderTypeHide = false
                this.utilityForm.get('utilityType').disable();
            } 
        }, error => {
        });
        this.verifyIdNumber();
    }

    skipProcess(): void {
        const utilitypayload = {
            applicationId: this.applicationId,
        };
        this.spinner.show();
        this.genericService.uplaodUtilityBill(utilitypayload, this.token).subscribe((result) => {
            this.spinner.hide();
            this.route.navigate(['/application-setup/approved-loans']);
            this.utilityForm.reset();
        }, (error) => {
            this.spinner.hide();
        });
    }

    onSubmit(): void {
        this.utilityForm.get('state').valueChanges.subscribe((value) => {
            if (value) {
                this.utilityForm.get('utilityType').reset();
                this.utilityForm.get('utilityType').markAsUntouched();
            }
        });
        if (!this.utilityForm.invalid && !this.invalidIdNumber && this.proceed) {
            this.spinner.show();
            const utilitypayload = {
                applicationId: this.applicationId,
                state: parseInt(this.utilityForm.value.state),
                utilityType: parseInt(this.utilityForm.value.utilityType),
                utilityName: parseInt(this.utilityForm.value.utilityName),
                idNumber: this.utilityForm.value.idNumber,
            };

            this.genericService.uplaodUtilityBill(utilitypayload, this.token).subscribe((result) => {
                const screenDetails = { "screenNumber": 16, "screenName": "Utility Bill", "applicationId": this.applicationId, "product": "PL" }
                this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
                this.route.navigate(['/application-setup/approved-loans']);
                this.spinner.hide();
                this.utilityForm.reset();
            }, (error) => {
                this.spinner.hide();

            });
        } else {
            this.utilityForm.get('utilityName').markAsTouched();
            if (this.utilityForm.get('utilityName').valid ||
                this.utilityForm.get('utilityType').value !== '2118'
            ) {
                this.utilityForm.get('idNumber').markAsTouched();
            }
            this.toaster.error('Identifier Number is invalid');
        }
    }
}
