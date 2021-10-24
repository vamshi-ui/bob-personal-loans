import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentInteractionService {

  public loan = new BehaviorSubject<any>('');
  public loanShare = this.loan.asObservable();

  public loan1 = new BehaviorSubject<any>('');
  public loanShare1 = this.loan1.asObservable();

  public dropoffValues = new BehaviorSubject<any>('');
  public popupShow = this.dropoffValues.asObservable();


  public borrowerDetails = new BehaviorSubject<any>('');
  public borrowerDetailsShare = this.borrowerDetails.asObservable();

  // public customerAge = new BehaviorSubject<any>('');
  // public customerAgeShare =  this.customerAge.asObservable();

  public autoDebit = new BehaviorSubject<any>('');
  public autoDebitShare = this.autoDebit.asObservable();

  public business = new BehaviorSubject<any>('');
  public businessShare = this.business.asObservable();

  public offerForYou = new BehaviorSubject<any>('');
  public offerShare = this.offerForYou.asObservable();

  public offerForYou1 = new BehaviorSubject<any>('');
  public offerShare1 = this.offerForYou1.asObservable();

  public thankYou = new BehaviorSubject<any>('');
  public ThankYouShare = this.thankYou.asObservable();

  public thankYou1 = new BehaviorSubject<any>('');
  public ThankYouShare1 = this.thankYou1.asObservable();

  public moneyInAccount = new BehaviorSubject<any>('');
  public moneyShare = this.moneyInAccount.asObservable();

  public moneyInAccount1 = new BehaviorSubject<any>('');
  public moneyShare1 = this.moneyInAccount1.asObservable();

  public payment = new BehaviorSubject<any>('');
  public paymentShare = this.payment.asObservable();

  public totalProgress = new BehaviorSubject<any>('');
  public totalProgressShare = this.totalProgress.asObservable();

  public totalProgress1 = new BehaviorSubject<any>('');
  public totalProgressShare1 = this.totalProgress1.asObservable();

  public insurance = new BehaviorSubject<any>('');
  public insuranceShare = this.insurance.asObservable();

  public insurance1 = new BehaviorSubject<any>('');
  public insuranceShare1 = this.insurance1.asObservable();


  public loginDetails = new BehaviorSubject<any>('');
  public loginDetailsShare = this.loginDetails.asObservable();

  public AddressDetails = new BehaviorSubject<any>('');
  public AddressDetailsShare = this.AddressDetails.asObservable();

  public mobileNo = new BehaviorSubject<any>('');
  public mobileNoShare = this.mobileNo.asObservable();

  public customerDetails = new BehaviorSubject<any>('');
  public customerDetailsShare = this.customerDetails.asObservable();

  public businessDetails = new BehaviorSubject<any>('');
  public businessDetailsShare = this.businessDetails.asObservable();

  public employeeDetails = new BehaviorSubject<any>('');
  public employeeDetailsShare = this.employeeDetails.asObservable();

  public offerDetails = new BehaviorSubject<any>('');
  public offerDetailsShare = this.offerDetails.asObservable();

  public legalHeir = new BehaviorSubject<any>('');
  public legalHeirShare = this.legalHeir.asObservable();

  public loanAmount = new BehaviorSubject<any>('');
  public loanAmountShare = this.loanAmount.asObservable();

  public termsCheckbox = new BehaviorSubject<any>('');
  public termsCheckBoxShare = this.termsCheckbox.asObservable();

  public displyaLoaderContent = new BehaviorSubject<any>('');
  public loaderText = this.displyaLoaderContent.asObservable();

  public processingFee = new BehaviorSubject<any>('');
  public processingFeeShare = this.processingFee.asObservable();
  
  public rejectTemplate = new BehaviorSubject<any>('');
  public rejectTemplateShare = this.rejectTemplate.asObservable();

  constructor() { }
}
