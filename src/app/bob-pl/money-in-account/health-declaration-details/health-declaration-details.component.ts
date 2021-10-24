import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorService } from 'src/app/shared/validations/validator.service';

@Component({
  selector: 'app-health-declaration-details',
  templateUrl: './health-declaration-details.component.html',
  styleUrls: ['./health-declaration-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HealthDeclarationDetailsComponent implements OnInit {

  public healthForm: FormGroup;
  isValid: boolean;
  constructor(private fb: FormBuilder, private validator: ValidatorService, private router: Router) { }

  ngOnInit(): void {
    this.healthDeclareForm();
  }

  healthDeclareForm() {
    this.healthForm = this.fb.group({
      height: this.validator.valid.height,
      weight: this.validator.valid.weight,
      checkBox1: this.validator.valid.checkBox,
      checkBox2: this.validator.valid.checkBox,
      checkBox3: this.validator.valid.checkBox,
      checkBox4: this.validator.valid.checkBox,
      checkBox5: this.validator.valid.checkBox,
      checkBox6: this.validator.valid.checkBox,
      checkBox7: this.validator.valid.checkBox,
      checkBox8: this.validator.valid.checkBox,
      checkBox9: this.validator.valid.checkBox,
      checkBox10: this.validator.valid.checkBox,
    });
  }



  NumberquoteOnly(event): boolean {
    const inp = String.fromCharCode(event.keyCode);

    if (/[0-9.']/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  weightquoteOnly(event): boolean {
    const inp = String.fromCharCode(event.keyCode);

    if (/[0-9.]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  // onSubmit(): void {
  //   if(this.healthForm.valid){
  //   this.router.navigate(['/']);
  //   }
  //   else{
  //     return;
  //   }
  // }
}
