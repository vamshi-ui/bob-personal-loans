import { Component, OnInit, ViewChild, Inject, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { WINDOW } from 'ngx-window-token';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';

import { GenericService } from '../../../shared/services/generic.service';

@Component({
    selector: 'app-provide-itr-statements',
    templateUrl: './provide-itr-statements.component.html',
    styleUrls: ['./provide-itr-statements.component.scss']
})

export class ProvideItrStatementsComponent implements OnInit {

    saveCustomerScreenDetails: Object;
    _window: any;

    token: any;
    applicationId: any;

    intervalId: any;
    itrLoader: boolean;
    getCommonCustomerDatadetails: any;
    gstStatus = false;
    myWindow: any;

    constructor(@Inject(WINDOW) _window,
        private genericService: GenericService,
        public router: Router,
        private dialog: MatDialog,
        private spinner: NgxSpinnerService) {

        this._window = _window;
    }

    @ViewChild('myDialog', { static: true }) myDialog: TemplateRef<any>;

    ngOnInit() {
        this.getToken();
    }

    getToken() {
        this.token = localStorage.getItem('token');
        this.applicationId = localStorage.getItem('applicationId');
        this.findGstStatus();
        this.getCustomerDetails();
    }

    findGstStatus() {
        let data = {
            appId: this.applicationId
        };
        this.spinner.show();

        this.genericService.getGstinDetails(data, this.token).subscribe((resp: any) => {
            this.spinner.hide();
            if (resp.statusMessage === "Record not found") { // if (resp && resp.evokeResponse && resp.evokeResponse.gstinsResponse) {
                this.gstStatus = false;
            } else {
                this.gstStatus = true;
            }
        }, (error) => {
            this.spinner.hide();
        });
    }

    getCustomerDetails() {

        const getCommonCustomerData =
        {
            'applicationId': this.applicationId
        }
        this.genericService.getCustomerStatus(getCommonCustomerData, this.token).subscribe(x => {
            this.getCommonCustomerDatadetails = x;
            // this.dialog.open(this.myDialog, { disableClose: true });
        })
    }

    loginToItr() {
        this.spinner.show();
        if (this.itrLoader) return;

        let postData = {
            applicationId: this.applicationId
        };

        this.genericService.itrOnline(postData, this.token).subscribe((resp: any) => {
            if (resp.url) {
                setTimeout(() => {
                    this.myWindow = window.open(resp.url, '_blank');
                    this.loginSetInterval();
                }, 1000)
            }
            this.spinner.hide();
        }, (error) => {
            this.spinner.hide();
        })
    }

    loginSetInterval() {
        this.itrLoader = true;

        this.intervalId = setInterval(() =>
            this.getPerfiosStatus()
            , 10000);

        // setTimeout(() => {
        //     clearInterval(this.intervalId); 
        //     console.log("Oops..Session Timeout"); 
        //     this.itrLoader = false; 
        // }, 100000);
    }

    getPerfiosStatus() {

        if (!this.myWindow) {
            // console.log("Unable to proceed");
        } else if (this.myWindow.closed) {
            // console.log("closed")
            this.spinner.hide();
            clearInterval(this.intervalId);
            this.itrLoader = false;
            return;
        } else {
            // console.log("not closed")
        }

        this.spinner.show();
        let postdata = {
            applicationId: this.applicationId
        };

        this.genericService.getPerfiosStatus(postdata, this.token).subscribe((resp: any) => {
            if (resp) {
                if (resp.action.toLowerCase() == 'success') {
                    this.itrLoader = false;
                    clearInterval(this.intervalId);
                    this.myWindow.close();
                    this.spinner.hide();
                    if (this.gstStatus === false) {
                        this.router.navigate(["/application-setup/utility-bill"]);
                    } else {
                        this.router.navigate(["/application-setup/verify-gst"]);
                    }
                } else if (resp.action == 'Wait') {
                    // this.itrLoader = false;
                    // clearInterval(this.intervalId);
                    // this.getCp();
                } else {
                    this.spinner.hide();
                    this.itrLoader = false;
                    this.myWindow.close();
                    clearInterval(this.intervalId);
                }
            }
        }, (error) => {
            this.myWindow.close();
            this.spinner.hide();
            this.itrLoader = false;
        });
    }

    updateItr() {
        if (this.itrLoader) return;

        const screenDetails = { "screenNumber": 12, "screenName": "Provide ITR statements", "applicationId": this.applicationId, "product": "PL" }
        this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })

        this.router.navigate(["/application-setup", "upload-itr-statements"]);
    }

    back() {
        if (this.itrLoader) return;
        this.router.navigate(["/application-setup", "upload-bank-statements"]);
    }

}
