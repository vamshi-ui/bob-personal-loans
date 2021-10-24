import { Injectable } from '@angular/core';
import {
  Validators,
  AbstractControl,
  ValidatorFn,
  FormControl,
} from '@angular/forms';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor() { }

  borrowerDetails = {
    accountHolder: ['',
      [Validators.required, Validators.pattern('^[0-9]*$'),
      ]
    ],
    AadhaarNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(12),
        // Validators.maxLength(16),
        // Validators.pattern(`^[0-9]*$`),
      ],
    ],
    AccountNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(14),
        Validators.pattern(`^[0-9]*$`)
      ],
    ],
    customerId: [
      '',
      [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(6),
      ]
    ],
    checkBox: [false, [Validators.requiredTrue]],
  };

  customerDetails = {
    prefix: ['', [Validators.required]],
    firstName: [
      '',
      [
        Validators.required,
        Validators.pattern(`^[a-zA-Z.' ]*$`),
        Validators.minLength(1),
        Validators.maxLength(50),
      ],
    ],

    employerName: [
      '',
      [
        Validators.required,
        Validators.pattern(`^[a-zA-Z.' ]*$`),
        Validators.minLength(1),
        Validators.maxLength(75),
      ],
    ],
    AadharNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(12),
      ],
    ],

    DOB: ['', [Validators.required]],
    // DOB: ['', [Validators.required, this.DateofBirthAgeValidator()]],
    PAN: [
      '',
      [
        Validators.required,
        Validators.pattern(`^[A-Za-z]{5}[0-9]{4}[A-Za-z]$`),
        Validators.minLength(10),
        Validators.maxLength(10),
        this.panNameValidator(),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^[a-z0-9A-Z._-]+@[a-zA-Z0-9]+\\.[a-zA-Z.]{2,5}$'
        ),
      ],
    ],
    spouse: [
      '',
      [
        Validators.required,
        Validators.pattern(`^[a-zA-Z.' ]*$`),
        Validators.minLength(1),
        Validators.maxLength(75),
      ],
    ],
    AddressOne: [
      '',
      [
        Validators.required,
        // Validators.pattern(`^[a-zA-Z0-9/ \\\\'.,-]*$`),
        Validators.pattern(`^[a-zA-Z0-9!%@#'$&( )-~^*\_|{}:?<>.+,/"]*$`),
        Validators.minLength(1),
        Validators.maxLength(60),
      ],
    ],
    pincode: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
    ],
    city: ['', [
      Validators.required,
      Validators.pattern(`^[a-z A-Z]*$`),
      Validators.minLength(3),]
    ],
  };

  nomineeDetails = {
    AppointeeName: ['', [Validators.pattern(`^[a-zA-Z.' ]*$`)]],
    DOB: ['', this.DateofBirthAgeValidator()],
    salaried: ['', [Validators.required, Validators.pattern('^[1-9]?[0-9]{1}$|^100$')]]
  };

  valid = {
    firstName: [
      '',
      [
        Validators.pattern(`^[a-zA-Z'. ]*$`),
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ],
    ],
    middleName: [
      '',
      [
        Validators.pattern(`^[a-zA-Z.' ]*$`),
        Validators.minLength(1),
        Validators.maxLength(50),
      ],
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.pattern(`^[a-zA-Z.' ]*$`),
        Validators.minLength(1),
        Validators.maxLength(50),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^[a-z0-9A-Z._-]+@[a-zA-Z0-9]+\\.[a-zA-Z]{2,4}$'
        ),
      ],
    ],
    mobile: [
      '',
      [
        Validators.required,
        Validators.pattern(`^[6-9]{1}[0-9]{9}$`),
        this.mobileNumberValidation(),
      ],
    ],
    mobileNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(`^[6-9]{1}[0-9]{9}$`),
        this.mobileNumberValidation(),
      ],
    ],
    age: [
      '',
      [
        Validators.required,
        // Validators.pattern('^1[89]|[2-5][0-9]|60$'),
        Validators.minLength(1),
        Validators.maxLength(3),
      ],
    ],
    pincode: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ],
    ],
    pan: [
      '',
      [
        Validators.required,
        Validators.pattern(`^[A-Za-z]{5}[0-9]{4}[A-Za-z]$`),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],
    ],
    nation: ['', [Validators.required]],
    prefix: ['', [Validators.required]],
    checkBox: [false, [Validators.requiredTrue]],
    otp: ['', Validators.required],
    accountNumber: [
      '',
      [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(8),
        Validators.maxLength(16),
      ],
    ],
    aadharNumber: [
      '',
      [
        Validators.required,
        Validators.pattern('^[1-9][0-9]*$'),
        Validators.minLength(12),
        Validators.maxLength(12),
        this.mobileNumberValidation()
      ],
    ],
    address: [
      '',
      [
        Validators.required,
        Validators.pattern(`^[a-zA-Z0-9!%@#'$&( )-~^*\_|{}:?<>.+,/"]*$`),
        // Validators.pattern(`^[a-zA-Z0-9/ \\\\'.,-]*$`),
        Validators.minLength(1),
        Validators.maxLength(60),
      ],
    ],
    city: ['',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ],
    ],
    state: ['',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ],
    ],
    salery: ['',
      [Validators.required,
      Validators.minLength(1),
      Validators.maxLength(26),
      Validators.pattern(`^[1-9][0-9,]*$`)]
    ],
    obligation: ['',
      [Validators.required,
      Validators.minLength(1),
      Validators.maxLength(12),
      Validators.pattern(`^[0-9,]*$`)]
    ],
    affiliationId: ['',
      [
        Validators.required,
        Validators.pattern(`^[a-zA-Z0-9]*$`),
        Validators.minLength(3),
        Validators.maxLength(16),
      ]
    ],
    height: ['', [Validators.required, Validators.pattern(`^[0-9/ \\\\'.]*$`)]],
    weight: ['', [Validators.required, Validators.pattern(`^[0-9/ \\\\.]*$`)]],
    utilityType: [''],
    utilityName: [''],
    idNumber: ['', [Validators.required, Validators.pattern(`^[a-zA-Z0-9]*$`), Validators.minLength(5),
    Validators.maxLength(25),

    ]],
    verifyGstUserName: ['',
      [
        Validators.required,
        Validators.pattern(`^[a-zA-Z.' ]*$`),
        Validators.minLength(1),
        Validators.maxLength(20),
      ],
    ],
  };

  document = {
    checkBox: new FormControl(false, Validators.requiredTrue),
    upload: new FormControl('', [Validators.required]),
  };

  DateofBirthAgeValidator(): any {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.pristine) {
        return null;
      }
      const date = control.value;
      const selectedDate = moment(date).format('YYYY-MM-DD');
      const ageCheck = moment().diff(selectedDate, 'days');
      // console.log(ageCheck);
      return (ageCheck < 6575 || ageCheck > 21915)
        ? { ageValid: true }
        : null;
    };
  }

  panNameValidator(): any {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.pristine) {
        return null;
      }
      const pan = control.value;
      const panUpper = pan.toUpperCase();
      return panUpper[3] !== 'P' ? { panName: true } : null;
    };
  }

  mobileNumberValidation(): any {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.pristine) {
        return null;
      }
      const forbiddenName = control.value;
      return forbiddenName[0] === forbiddenName[1] &&
        forbiddenName[0] === forbiddenName[2] &&
        forbiddenName[0] === forbiddenName[3] &&
        forbiddenName[0] === forbiddenName[4] &&
        forbiddenName[0] === forbiddenName[5] &&
        forbiddenName[0] === forbiddenName[6] &&
        forbiddenName[0] === forbiddenName[7] &&
        forbiddenName[0] === forbiddenName[8] &&
        forbiddenName[0] === forbiddenName[9]
        ? { misMatch: true }
        : null;
    };
  }

}
