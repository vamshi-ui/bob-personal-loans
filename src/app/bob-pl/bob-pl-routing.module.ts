import { VerifyBankStatementComponent } from './application-setup/verify-bank-statement/verify-bank-statement.component';
import { BasicDetailsTncComponent } from './application-setup/basic-details-tnc/basic-details-tnc.component';
import { AutoDebitSetupComponent } from './application-setup/auto-debit-setup/auto-debit-setup.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { AdditionalInsuranceDetailsComponent } from './money-in-account/additional-insurance-details/additional-insurance-details.component';
import { ApplicationSetupComponent } from './application-setup/application-setup.component';
import { ApprovedLoanDetailsComponent } from './application-setup/approved-loan-details/approved-loan-details.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { BorrowerDetailsComponent } from './basic-details/borrower-details/borrower-details.component';
import { LoginComponent } from './basic-details/login/login.component';
import { PreApprovedLoanComponent } from './basic-details/pre-approved-loan/pre-approved-loan.component';
import { RequirementsComponent } from './basic-details/requirements/requirements.component';
import { AutoDebitDetailsComponent } from './application-setup/auto-debit-details/auto-debit-details.component';
import { DisbursalDetailsComponent } from './application-setup/disbursal-details/disbursal-details.component';
import { EContractTncComponent } from './application-setup/e-contract-tnc/e-contract-tnc.component';
import { EKycComponent } from './application-setup/e-kyc/e-kyc.component';
import { HealthDeclarationDetailsComponent } from './money-in-account/health-declaration-details/health-declaration-details.component';
import { ImageKycComponent } from './application-setup/image-kyc/image-kyc.component';
import { LegalHeirDetailsComponent } from './application-setup/legal-heir-details/legal-heir-details.component';
import { PaymentGatewayComponent } from './application-setup/payment-gateway/payment-gateway.component';
import { SiMandateComponent } from './application-setup/si-mandate/si-mandate.component';
import { UploadBankStatementComponent } from './application-setup/upload-bank-statement/upload-bank-statement.component';
import { UploadItrStatementsComponent } from './application-setup/upload-itr-statements/upload-itr-statements.component';
import { UtilityBillDetailsComponent } from './application-setup/utility-bill-details/utility-bill-details.component';
import { VerifyGSTComponent } from './application-setup/verify-gst/verify-gst.component';
import { VerifyItrStatementsComponent } from './application-setup/verify-itr-statements/verify-itr-statements.component';
import { VideoKycComponent } from './application-setup/video-kyc/video-kyc.component';
import { OffersForYouComponent } from './offers-for-you/offers-for-you.component';
import { UserInputDetailsComponent } from './user-input-details/user-input-details.component';
import { CustomerDetailsComponent } from './user-input-details/customer-details/customer-details.component';
import { EmploymentDetailsComponent } from './user-input-details/employment-details/employment-details.component';
import { LoanDetailsComponent } from './user-input-details/loan-details/loan-details.component';
import { ErrorPageComponent } from './user-input-details/error-page/error-page.component';
import { MoneyInAccountComponent } from './money-in-account/money-in-account.component';
import { BusinessDetailsComponent } from './user-input-details/business-details/business-details.component';
import { ProvideBankStatementsComponent } from './application-setup/provide-bank-statements/provide-bank-statements.component';
import { ProvideItrStatementsComponent } from './application-setup/provide-itr-statements/provide-itr-statements.component';
import { ProvideGstStatementsComponent } from './application-setup/provide-gst-statements/provide-gst-statements.component';
import { ThankyouDetailsComponent } from './money-in-account/thankyou-details/thankyou-details.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { RevisitingLoanJourneyComponent } from './revisiting-loan-journey/revisiting-loan-journey.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AIPLoanDetailsComponent } from './user-input-details/aip-loan-details/aip-loan-details.component';
import { PaymentGatewayResultComponent } from './application-setup/payment-gateway-result/payment-gateway-result.component';
import { ResendOtpDialogComponent } from './resend-otp-dialog/resend-otp-dialog.component';
import { FactaCrsComponent } from './facta-crs/facta-crs.component';
import { ProcessingDetailsComponent } from './application-setup/processing-details/processing-details.component';
import { OfferRejectComponent } from './offer-reject/offer-reject.component';
import { BureauTncComponent } from './bureau-tnc/bureau-tnc.component';
import { PrimaryAccountComponent } from './application-setup/primary-account/primary-account.component';

const routes: Routes = [
  {
    path: '', component: BasicDetailsComponent,
    children: [
      { path: '', pathMatch: 'requirements', component: RequirementsComponent },
      { path: 'requirements', component: RequirementsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'borrower-details', component: BorrowerDetailsComponent },
      { path: 'pre-approved-details', component: PreApprovedLoanComponent }
    ]
  },
  {
    path: 'user-input', component: UserInputDetailsComponent,
    children: [
      { path: 'customer-details', component: CustomerDetailsComponent },
      { path: 'employment-details', component: EmploymentDetailsComponent },
      { path: 'business-details', component: BusinessDetailsComponent },
      { path: 'loan-details', component: LoanDetailsComponent },
      { path: 'error', component: ErrorPageComponent },
      { path: 'aip-loan-details', component: AIPLoanDetailsComponent },
    ]

  },
  {
    path: 'application-setup', component: ApplicationSetupComponent,
    children: [
      { path: 'provide-bank-statements', component: ProvideBankStatementsComponent },
      // { path: 'additional-insurance', component: AdditionalInsuranceDetailsComponent },
      { path: 'approved-loans', component: ApprovedLoanDetailsComponent },
      { path: 'auto-debit-setup', component: AutoDebitSetupComponent },
      { path: 'auto-debit', component: AutoDebitDetailsComponent },
      { path: 'basic-tnc', component: BasicDetailsTncComponent },
      { path: 'disbursal', component: DisbursalDetailsComponent },
      { path: 'e-contract', component: EContractTncComponent },
      { path: 'e-kyc', component: EKycComponent },
      // { path: 'health-declaration', component: HealthDeclarationDetailsComponent },
      { path: 'image-kyc', component: ImageKycComponent },
      { path: 'legal-heir', component: LegalHeirDetailsComponent },
      { path: 'payment-gateway', component: PaymentGatewayComponent },
      { path: 'payment-gateway-result', component: PaymentGatewayResultComponent },
      { path: 'provide-itr-statements', component: ProvideItrStatementsComponent },
      { path: 'provide-gst-statements', component: ProvideGstStatementsComponent },
      { path: 'si-mandate', component: SiMandateComponent },
      { path: 'upload-bank-statements', component: UploadBankStatementComponent },
      { path: 'upload-itr-statements', component: UploadItrStatementsComponent },
      { path: 'utility-bill', component: UtilityBillDetailsComponent },
      { path: 'verify-bank-statement', component: VerifyBankStatementComponent },
      { path: 'verify-gst', component: VerifyGSTComponent },
      { path: 'verify-itr', component: VerifyItrStatementsComponent },
      { path: 'video-kyc', component: VideoKycComponent },
      { path: 'processing-details', component: ProcessingDetailsComponent },
      {path :'primary-account',component: PrimaryAccountComponent}
    ]
  },
  {
    path: 'offers-for-you', component: OffersForYouComponent,

  },
  {
    path: 'offer-reject', component: OfferRejectComponent,
  },
  {
    path: 'money-in-account', component: MoneyInAccountComponent,
    children: [
      { path: '', component: ThankyouDetailsComponent },
      { path: 'additional-insurance', component: AdditionalInsuranceDetailsComponent },
      { path: 'health-declaration', component: HealthDeclarationDetailsComponent },
    ]
  },
  {
    path: 'terms-and-conditions', component: TermsAndConditionsComponent,

  },
  {
    path: 'bureau-tnc', component: BureauTncComponent,

  },
  {
    path: 'disclaimer', component: DisclaimerComponent,

  },
  {
    path: 'privacy-policy', component: PrivacyPolicyComponent,

  },
  {
    path: 'revisit-loan-journey', component: RevisitingLoanJourneyComponent,

  },

  {
    path: 'resend-otp', component: ResendOtpDialogComponent,
  },

  {
    path: 'facta-crs', component: FactaCrsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BobPlRoutingModule { }
