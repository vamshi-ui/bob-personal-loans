import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { GenericService } from '../../../shared/services/generic.service';

@Component({
    selector: 'app-provide-gst-statements',
    templateUrl: './provide-gst-statements.component.html',
    styleUrls: ['./provide-gst-statements.component.scss']
})

export class ProvideGstStatementsComponent implements OnInit {

    token: any;
    appId: any;
    appPackId: any;

    constructor(private genericService: GenericService) {

    }

    ngOnInit() {
        this.getToken();
    }

    getToken() {
        this.token = localStorage.getItem('token');
        this.appId = localStorage.getItem('applicationId');
        this.appPackId = localStorage.getItem('appPackId');
    }

}
