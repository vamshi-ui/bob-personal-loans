import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { WINDOW } from 'ngx-window-token';
import { Router, ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { GenericService } from '../../../shared/services/generic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-provide-bank-statements',
	templateUrl: './provide-bank-statements.component.html',
	styleUrls: ['./provide-bank-statements.component.scss']
})

export class ProvideBankStatementsComponent implements OnInit {

	getPrimaryDetails: any;
	saveCustomerScreenDetails: Object;
	perfiosFormGroup: FormGroup;

	@ViewChild('bankForm', { static: false }) bankForm: ElementRef;

	_window: any;

	token: any;
	appId: any;
	appPackId: any;
	bankFormValues: any;
	customerDetails: any;
	accDtls: any;
	saveaccDtls: any;
	perfiosId: boolean;
	getCustomerData: any;

	constructor(@Inject(WINDOW) _window,
		private genericService: GenericService,
		private fb: FormBuilder,
		public router: Router,
		private toastr: ToastrService,
		private route: ActivatedRoute,
		private spinner: NgxSpinnerService) {

		this._window = _window;

		this.bankFormValues = {
			url: '',
			payload: '',
			signature: ''
		}

		this.perfiosFormGroup = this.fb.group({
			accountType: [''],
		});
		this.saveaccDtls = { accNo: '' };
		this.perfiosId = false;
		this.accDtls = '';
		this.route.queryParams.subscribe(params => {

			if (params && params.id) {
				this.perfiosId = true;
			}
		});

	}

	ngOnInit() {
		this.getToken();
		this.getCustomerDetails();
		this.getPerfiosTransAccountDtls();
	}

	getToken() {
		this.token = localStorage.getItem('token');
		this.appId = localStorage.getItem('applicationId');
		this.appPackId = localStorage.getItem('appPackId');
	}

	loginToBank() {
		this.spinner.show();
		let postData = {
			appId: this.appId,
			returnUrl: ''
		};

		if (this.customerDetails) {
			if (this.customerDetails.jobType == 'Salaried') {
				postData.returnUrl = this._window.location.origin + '/pl/application-setup/provide-bank-statements?id=%s'
			} else {
				postData.returnUrl = this._window.location.origin + '/pl/application-setup/provide-bank-statements?id=%s'
			}
		}

		this.genericService.netBankingPerfiosLogin(postData, this.token).subscribe((resp: any) => {
			if (resp.url) {
				this.bankFormValues = resp;
				setTimeout(() => {
					this.bankForm.nativeElement.submit();
				}, 1000)
			}
			this.spinner.hide();
		}, (error) => {
			this.spinner.hide();
		})
	}

	getCustomerDetails() {
		const customerDetails = {
			applicationId: this.appId
		};

		this.genericService.getCustomerStatus(customerDetails, this.token).subscribe(resp => {
			this.getCustomerData = resp;
			if (resp) {
				const screenDetails = { "screenNumber": 10, "screenName": "Provide bank statements", "applicationId": this.appId, "product": "PL" }
				this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
				this.customerDetails = resp;
			}

		});
	}

	back() {
		const data = { "applicationId": this.appId }
		this.genericService.getPrimaryAccountDetails(data, this.token).subscribe(x => {
			this.getPrimaryDetails = x;
			if (this.getCustomerData.accountHolder == 'No' || this.getPrimaryDetails.accDtls.length == 0) {
				this.router.navigate(["/offers-for-you"]);
			} else {
				this.router.navigate(["/application-setup/primary-account"]);
			}
		}, err => { })


	}

	getPerfiosTransAccountDtls() {
		this.spinner.show();

		let customerDetails = {
			applicationId: this.appId,
			id: this.perfiosId
		};
		this.genericService.getPerfiosTransAccountDtls(customerDetails, this.token).subscribe((resp: any) => {
			if (resp.status.toLowerCase() == 'success') {

				if (resp.accDtls && resp.accDtls.length) {
					this.accDtls = new Array();
					resp.accDtls.forEach((item: any) => {
						if (resp.accDtls.length == 1) {
							item.primaryAcc = true;
							this.saveaccDtls.accNo = item.accountNo;

						}
						this.accDtls.push(item);
						if (item.primaryAcc) {
							this.saveaccDtls.accNo = item.accountNo;

						}
					});
				}


			}
			this.spinner.hide();
		}, (error) => {
			this.spinner.hide();
		})
	}

	saveAccountdetails(data, index) {

		this.saveaccDtls.accNo = data.accountNo;

		for (let i = 0; i < this.accDtls.length; i++) {
			if (i == index) {
				this.accDtls[i].primaryAcc = true;
			}
			else {
				this.accDtls[i].primaryAcc = false;
			}
		}

	}

	proceedNext() {

		// console.log(this.saveaccDtls)
        // if(!this.saveaccDtls.accNo) {
        //     console.log("!this.saveaccDtls.accNo");
        // }
        // if(this.saveaccDtls.accNo === '') {
        //     console.log("this.saveaccDtls.accNo === ''");
        // }
        // if(!this.saveaccDtls.accountNo) {
        //     console.log("!this.saveaccDtls.accountNo");
        // }
		if (this.saveaccDtls && !this.saveaccDtls.accNo) {
			this.toastr.error('Please select your Primary Account', '', { timeOut: 4000 });
			return;
		}

		this.spinner.show();

		let data = {
			accNo: this.saveaccDtls.accNo,
			applicationId: this.appId

		}
		this.genericService.savePerfiosPrimaryAccountDtls(data, this.token).subscribe((resp: any) => {
			if (resp.status.toLowerCase() == 'success') {
				if (this.customerDetails.jobType == 'Salaried') {
					this.router.navigate(["/application-setup/utility-bill"]);

				} else {
					this.router.navigate(["/application-setup/provide-itr-statements"]);

				}
			}
			this.spinner.hide();
		}, (error) => {
			this.spinner.hide();
		})
	}
}
