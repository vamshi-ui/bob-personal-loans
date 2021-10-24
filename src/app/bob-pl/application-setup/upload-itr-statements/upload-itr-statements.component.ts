import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

import { GenericService } from '../../../shared/services/generic.service';
import { DocumentsService } from '../../../shared/services/documents-service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-upload-itr-statements',
	templateUrl: './upload-itr-statements.component.html',
	styleUrls: ['./upload-itr-statements.component.scss'],
	encapsulation: ViewEncapsulation.None,
})

export class UploadItrStatementsComponent implements OnInit {
	saveCustomerScreenDetails: Object;
	file: File;
	ITR: any = [];

	Form: any = [];
	ITRfile: File;
	formHide: any = true;
	ITRHide: any = true;
	chooseFileHide: any = true;
	fileUpload: any = false;
	fileName: any;
	formTwoHide: any;
	ITRTwoHide: any;
	formTwoClose: boolean;
	ITRTwoClose: boolean;
	ITROneClose: boolean;
	formOneClose: boolean;

	base64format: any = [];
	base64formatItr: any = [];
	FilepushArray: any = [];
	FilepushItrArray: any = [];

	fileDocumentPush: any = [];

	applicationId: string;
	token: string;
	cpID: string;

	failureForm26: boolean;
	form26Loader: boolean;
	itrLoader: boolean;
	formSubmitted: boolean;
	blankFile = false;
	docTypeId: number;
	skipGst = false;
	customerDetails: any;

	constructor(private fb: FormBuilder,
		public dialog: MatDialog,
		private route: Router,
		public docService: DocumentsService,
		private genericService: GenericService,
		private spinner: NgxSpinnerService,
		private toastr: ToastrService) {
	}

	ngOnInit() {
		this.getCacheData();
		this.getDMSDocumentDtls();
	}

	getCacheData() {
		this.applicationId = localStorage.getItem('applicationId');
		this.cpID = localStorage.getItem('cpId');
		this.token = localStorage.getItem('token');
		this.findGstStatus();
		this.getCustomerData();
	}

	findGstStatus() {
		let data = {
			appId: this.applicationId
		};
		this.spinner.show();

		this.genericService.getGstinDetails(data, this.token).subscribe((resp: any) => {
			this.spinner.hide();
			if (resp.statusMessage === "Record not found") { // if (resp && resp.evokeResponse && resp.evokeResponse.gstinsResponse) {
				this.skipGst = true;
			} else {
				this.skipGst = false;
				// this.gstDetails = resp.itrResponse.gstinsResponse;
			}
		}, (error) => {
			this.spinner.hide();
		});
	}

	getCustomerData() {
		const customerDetails = {
			applicationId: this.applicationId
		};
		this.spinner.show();
		this.genericService.getCustomerStatus(customerDetails, this.token).subscribe(result => {
			this.spinner.hide();
			this.customerDetails = result;
		}, error => {
			this.spinner.hide();
		});
	}

	getDMSDocumentDtls() {

		let data = {
			documentCode: 'FINANCEITR',
		}
		this.genericService.getDMSDocumentDtls(data, this.token).subscribe((resp: any) => {
			if (resp.status.toLowerCase() == 'success') {
				this.docTypeId = resp.docTypeId;
			}
		}, (error) => {
		})
	}

	addItem(templateRef: TemplateRef<any>) {
		this.dialog.open(templateRef, {
			width: '550px',
			height: '220px',
			disableClose: true,
		});
		this.blankFile = true;
		// if (this.ITRTwoClose === true) {
		// 	this.blankFile = true;
		// } else {
		// 	this.blankFile = false ;
		// }
	}

	handleFormInput(file) {
		if (this.form26Loader) {
			return;
		}
		this.form26Loader = true;
		this.failureForm26 = false;

		const files = file.target.files;

		if (files && files[0].type == "application/pdf") {

			let fileName = files[0].name;

			const itrMetadata = {
				cpID: this.cpID,
				documentType: {
					documentGroupType: 'ITR_PDF',
					documentTypeID: 481,
					documentName: 'ITR_PDF'
				},
				documentId: 0,
				appID: this.applicationId,
			};
			this.spinner.show();

			this.docService.uploadItrFile(files.item(0), itrMetadata, this.token).subscribe((resp: any) => {
				if (resp && resp.status && resp.status.toLowerCase() == 'success') {
					this.Form.push(files[0]);
					this.formHide = false;
					this.formTwoHide = false;
					this.formTwoClose = true;
					this.formOneClose = true;
					this.FilepushArray.push({ file: files });
				} else {
					this.toastr.error('File is not uploaded', '', { timeOut: 2000 });
					file.target.value = '';
				}
				this.spinner.hide();
				this.form26Loader = false;
			}, (error) => {
				this.spinner.hide();
				this.form26Loader = false;
				this.toastr.error('File is not uploaded', '', { timeOut: 2000 });
				file.target.value = '';
			});
		} else {
			file.target.value = '';
			this.toastr.error('File Format must be PDF', '', { timeOut: 2000 });
			this.form26Loader = false;
		}
	}

	removeFile(index) {
		this.Form.splice(index, 1);
		if (this.Form.length === 0) {
			this.formTwoHide = true;
			this.formTwoClose = false;
		} else {
			this.formTwoHide = false;
		}
		this.formHide = false;
	}

	handleITRInput(file) {
		if (this.itrLoader) {
			return;
		}
		this.itrLoader = true;

		const files = file.target.files;
		if (files.length > 1) {
			this.blankFile = true;
		}
		else {
			this.blankFile = false;
		}

		if (files && files[0].type == "application/pdf") {
			let fileName = files[0].name;
			const itrMetadata = {
				cpID: this.cpID,
				documentType: {
					documentGroupType: 'FINANCE',
					documentTypeID: this.docTypeId,
					documentName: 'Income Tax Returns(ITR)',
				},
				documentId: 0,
				appID: this.applicationId,
			};
			this.spinner.show();

			this.docService.uploadItrFile(files.item(0), itrMetadata, this.token).subscribe((resp: any) => {
				if (resp && resp.status && resp.status.toLowerCase() == 'success') {
					this.ITR.push(files[0]);
					this.ITRHide = false;
					this.ITRTwoHide = false;
					this.ITRTwoClose = true;
					this.ITROneClose = true;
					this.FilepushItrArray.push({ file: this.file });
				} else {
					this.toastr.error('File is not uploaded', '', { timeOut: 2000 });
					file.target.value = '';
				}
				this.spinner.hide();
				this.itrLoader = false;
			}, (error) => {
				this.spinner.hide();
				this.itrLoader = false;
				this.toastr.error('File is not uploaded', '', { timeOut: 2000 });
				file.target.value = '';
			});
		} else {
			file.target.value = '';
			this.itrLoader = false;
			this.toastr.error('File Format must be PDF', '', { timeOut: 2000 });
		}
	}

	removeITR(index) {
		this.ITR.splice(index, 1);
		if (this.ITR.length === 0) {
			this.ITRTwoHide = true;
			this.ITRTwoClose = false;
		} else {
			this.ITRTwoHide = false;
			this.blankFile = false;
		}
		this.ITRHide = false;
		this.blankFile = false;
	}

	form26As() {
		this.formHide = true;
		this.formTwoHide = false;
	}

	itr() {
		if (this.ITR.length === 0) {
			return;
		} else {
			this.ITRHide = true;
			this.ITRTwoHide = false;
		}
	}

	formClose() {
		this.formHide = false;
	}

	ITRClose() {
		this.ITRHide = false;
		this.blankFile = false;
	}

	goBack() {
		this.route.navigate(['/application-setup/provide-itr-statements']);
	}

	onSubmit() {
		if (this.ITR.length === 0 || this.ITRHide === true) {
			this.toastr.error('Please Upload ITR Statement', '', { timeOut: 2000 });
			return;
		}
		if (this.formSubmitted) {
			return;
		}
		const screenDetails = { "screenNumber": 13, "screenName": "Upload ITR statements", "applicationId": this.applicationId, "product": "PL" }
		this.genericService.saveCustomerScreenData(screenDetails, this.token).subscribe(x => { this.saveCustomerScreenDetails = x })
		this.base64formatItr = [];
		this.base64format = [];
		if (this.ITRTwoHide === true) {
			this.blankFile = false;
		}

		// if (this.ITR.length >= 1 || this.Form.length >= 1) {
		else if (this.ITR.length >= 1 && this.blankFile === false) {
			this.spinner.show();
			this.formSubmitted = true;
			let data = {
				applicationId: this.applicationId,
				mandatoryDocumentTypes: 'ITR_PDF',
				password: ''
			};

			this.genericService.itrUpload(data, this.token).subscribe((resp: any) => {
				if (resp.status.statusCode === 200) {
					// if (this.customerDetails.appliedLoanAmount > this.customerDetails.preapprovedamt) {
					// 	this.route.navigate(['/application-setup/approved-loans']);
					// } else {
					if (this.skipGst === true) {
						this.route.navigate(["/application-setup/utility-bill"]);
					} else {
						this.route.navigate(["/application-setup/verify-gst"]);
					}
					// }
				} else {
					this.spinner.hide();
					if (resp.status.statusMessage !== "") {
						this.toastr.error(resp.status.statusMessage)
					}

				}
				this.spinner.hide();
				this.formSubmitted = false;
			}, (error) => {
				this.spinner.hide();
				this.formSubmitted = false;
			});
		} else {
			this.toastr.error('Please Upload Your Statement', '', { timeOut: 2000 });
			if (this.blankFile === true) {
				this.toastr.error('Please Upload ITR Statement', '', { timeOut: 2000 });
			}
		}
	}

}
