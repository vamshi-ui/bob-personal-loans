import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import * as _moment from 'moment';
import { formatDate } from '@angular/common';

import { defaultFormat as _rollupMoment } from 'moment';
import { Router } from '@angular/router';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-video-kyc-dialog',
  templateUrl: './video-kyc-dialog.component.html',
  styleUrls: ['./video-kyc-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class VideoKycDialogComponent implements OnInit {
  accountHolder: string;
  approvalLoan: string;
  currentDateNew: string;
  public DateHide;
  public DateformatHide = true;
  defaultValue: Date;

  currentDate: any = new Date();
  selectedTime: string;
  CurrentTime: any;
  date: FormControl;
  vedioKYCForm: FormGroup;
  CurrentTimeFormatChange: any;
  timeString: string;
  timeError: boolean;
  minValue: Date;
  maxValue: Date;

  constructor(
    public datePipe: DatePipe,
    public fb: FormBuilder,
    private atp: AmazingTimePickerService,
    public route: Router
  ) { }

  ngOnInit(): void {
    this.Time();
    this.form();
    this.getToken();
  }

  getToken(): void {
    this.approvalLoan = localStorage.getItem('approvalLoan');
    this.accountHolder = localStorage.getItem('accountHolder');
  }

  Time(): void {
    this.CurrentTime = this.datePipe.transform(this.currentDate, 'HH:mm');

    const date = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    this.timeString = date.toLocaleString('en-US', options);

    const minValue = new Date();
    minValue.getHours();
    minValue.getMinutes();
  }

  form(): void {
    this.vedioKYCForm = this.fb.group({
      date: [_moment()],
      time: '',
    });

  }

  onSelectTime(): void {
    this.vedioKYCForm.patchValue({
      time: new Date()
    });
  }
  
  TimeValue(): void {
    const currentOne = this.datePipe.transform(this.currentDate, 'dd/MM/yyyy');
    const newOne = this.datePipe.transform(
      this.vedioKYCForm.value.date,
      'dd/MM/yyyy'
    );

    if (currentOne === newOne) {
      const minValue = new Date();
      minValue.getHours();
      minValue.getMinutes();
      this.minValue = minValue;
    } else {
      this.minValue = null;
    }
  }

  onSubmit(): void {
    if (this.vedioKYCForm.value.time === '') {
      this.vedioKYCForm.value.time = this.CurrentTime;
      this.vedioKYCForm.value.date = this.datePipe.transform(
        this.vedioKYCForm.value.date,
        'dd/MM/yyyy'
      );
    } else {
      this.vedioKYCForm.value.date = this.datePipe.transform(
        this.vedioKYCForm.value.date,
        'dd/MM/yyyy'
      );
      this.vedioKYCForm.value.time = this.datePipe.transform(
        this.vedioKYCForm.value.time,
        'HH:mm'
      );
    }
    this.route.navigate(['/application-setup/e-contract']);
  }
}
