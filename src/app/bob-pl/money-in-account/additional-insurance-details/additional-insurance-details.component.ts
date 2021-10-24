import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentInteractionService } from 'src/app/shared/material-modules/component-interaction.service';
import { ValidatorService } from 'src/app/shared/validations/validator.service';
import { Moment } from 'moment';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
// import  from 'moment';

@Component({
  selector: 'app-additional-insurance-details',
  templateUrl: './additional-insurance-details.component.html',
  styleUrls: ['./additional-insurance-details.component.scss'],
})
export class AdditionalInsuranceDetailsComponent implements OnInit {
  nomineeDetailForm: FormGroup;
  appointeeValue = false;
  maxDate = new Date();
  minDate = new Date('1961');
  isValid: boolean;

  constructor(
    private fb: FormBuilder,
    private service: ComponentInteractionService,
    public validator: ValidatorService,
    private route: Router,
    private spinenr: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.nomineeDetailForm = this.fb.group({
      itemRows: this.fb.array([this.initItemRows()]),
    });
    this.disabledFields(0);
  }

  get formArr() {
    return this.nomineeDetailForm.get('itemRows') as FormArray;
  }

  initItemRows(): FormGroup {
    return this.fb.group({
      nomineeName: this.validator.customerDetails.firstName,
      share: this.validator.nomineeDetails.salaried,
      dobNominee: this.validator.customerDetails.DOB,
      relWithLifeAssured: this.validator.valid.prefix,
      appointeeName: [''],
      dobAppointee: this.validator.nomineeDetails.DOB,
      relWithLifeNominee: this.validator.valid.prefix,
    });
  }

  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  disabledFields(i) {
    const controls = 'controls';
    this.nomineeDetailForm.get('itemRows')[controls][i].get('dobAppointee').disable();
  }

  appointeeDOB(value, i) {
    const controls = 'controls';
    if (value.length >= '2') {
      this.appointeeValue = true;
      this.nomineeDetailForm.setErrors({ invalid: true });
      this.nomineeDetailForm.get('itemRows')[controls][i].get('dobAppointee').enable();
      this.nomineeDetailForm.get('itemRows')[controls][i].get('dobAppointee').reset();
    } else {
      this.appointeeValue = false;
      this.nomineeDetailForm.get('itemRows')[controls][i].get('dobAppointee').setErrors({ invalid: false });
      this.nomineeDetailForm.get('itemRows')[controls][i].get('dobAppointee').disable();
      this.nomineeDetailForm.get('itemRows')[controls][i].get('dobAppointee').reset();
    }
  }

  get arrControl() {
    return (this.nomineeDetailForm.get('itemRows') as FormArray).controls;

  }

  onSubmit() {
    if (this.nomineeDetailForm.valid) {
      this.service.insurance.next(4.5);
      this.service.insurance1.next(19);
      this.route.navigate(['/money-in-account/health-declaration'])
    }
    else {
      return;
    }

  }
}
