import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GenericService } from 'src/app/shared/services/generic.service';

@Component({
  selector: 'app-si-mandate',
  templateUrl: './si-mandate.component.html',
  styleUrls: ['./si-mandate.component.scss']
})
export class SiMandateComponent implements OnInit {
  

  siMandateData = {
    name: 'Mr Akhil reddy',
    bankName: 'Bank of Baroda',
    accountName: 'Account Number',
    accountType: 'savings',
    amount: 40000,
    startDate: '06/04/2020',
    endDate: '11/04/2020',
    frequency: 'Monthly',
    purposeOfMandate: 'Loan repayment',
    corporateName: 'Indusland Bank',
    UtilityNumber: 435435,
    referenceNo: 93824732,
    emiDebitDate: '06',
    registrationId: 232
  }
  constructor(private genreicService: GenericService) { }

  ngOnInit() {
    this.genreicService.getSiMandateDetails().subscribe((data:any)=>{
      this.siMandateData = data;
    })
  }

  /**
   * @author Akhil
   * This function to create form group for si-mandate screen 
   */


}
