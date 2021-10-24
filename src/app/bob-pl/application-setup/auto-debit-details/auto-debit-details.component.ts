import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { ComponentInteractionService } from '../../../shared/material-modules/component-interaction.service';
import { GenericService } from '../../../shared/services/generic.service';

@Component({
    selector: 'app-auto-debit-details',
    templateUrl: './auto-debit-details.component.html',
    styleUrls: ['./auto-debit-details.component.scss']
})

export class AutoDebitDetailsComponent implements OnInit {

    saveCustomerScreenDetails: Object;
    emandateDetailsForm: FormGroup;
    token: any;
    appId: any;

    constructor(private service: ComponentInteractionService,
        public fb: FormBuilder,
        private router: Router,
        private genericService: GenericService,
        private spinner: NgxSpinnerService) {

        this.createForm();
    }

    createForm() {
        this.emandateDetailsForm = this.fb.group({
            name: [''],
            bankName: [''],
            accountNumber: [''],
            accountType: [''],
            loanAmount: [''],
            startDate: [''],
            endDate: [''],
            frequency: [''],
            purposeOfemandate: [''],
            referenceNo: [''],
            emiDebitDate: [''],
        });
    }

    ngOnInit() {
        this.getToken();
    }

    getToken() {
        this.token = localStorage.getItem('token');
        this.appId = localStorage.getItem('applicationId');
        this.getMandateDetails();
    }

    continue() {
        const screenDetails = { "screenNumber": 18, "screenName": "SI mandate details", "applicationId": this.appId, "product": "PL" }
        this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
        this.service.autoDebit.next('Money-In-Account');
        this.router.navigate(['/application-setup/disbursal']);
    }

    getMandateDetails() {
        this.spinner.show();
        const postData = {
            applicationId: this.appId
        };

        this.genericService.mandateDetails(postData, this.token).subscribe((resp: any) => {
            if (resp) {
                this.emandateDetailsForm.patchValue(resp);
            }
            this.spinner.hide();
        }, (error) => {
            this.spinner.hide();
        });
    }

    back() {
        this.router.navigate(['/application-setup/auto-debit-setup']);
    }

}
