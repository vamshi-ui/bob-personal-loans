import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BobPlRoutingModule } from './bob-pl-routing.module';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { RequirementsComponent } from './basic-details/requirements/requirements.component';
import { LoginComponent } from './basic-details/login/login.component';
import { BorrowerDetailsComponent } from './basic-details/borrower-details/borrower-details.component';
import { PreApprovedLoanComponent } from './basic-details/pre-approved-loan/pre-approved-loan.component';
import { UserInputDetailsComponent } from './user-input-details/user-input-details.component';
import { CustomerDetailsComponent } from './user-input-details/customer-details/customer-details.component';
import { EmploymentDetailsComponent, EmailDialogComponent } from './user-input-details/employment-details/employment-details.component';
import { ErrorPageComponent } from './user-input-details/error-page/error-page.component';
import { LoanDetailsComponent } from './user-input-details/loan-details/loan-details.component';
import { OffersForYouComponent } from './offers-for-you/offers-for-you.component';
import { ApplicationSetupComponent } from './application-setup/application-setup.component';
import { UploadBankStatementComponent } from './application-setup/upload-bank-statement/upload-bank-statement.component';
import { VerifyBankStatementComponent } from './application-setup/verify-bank-statement/verify-bank-statement.component';
import { UploadItrStatementsComponent } from './application-setup/upload-itr-statements/upload-itr-statements.component';
import { VerifyItrStatementsComponent } from './application-setup/verify-itr-statements/verify-itr-statements.component';
import { VerifyGSTComponent } from './application-setup/verify-gst/verify-gst.component';
import { UtilityBillDetailsComponent } from './application-setup/utility-bill-details/utility-bill-details.component';
import { ApprovedLoanDetailsComponent } from './application-setup/approved-loan-details/approved-loan-details.component';
import { LegalHeirDetailsComponent } from './application-setup/legal-heir-details/legal-heir-details.component';
// tslint:disable-next-line: max-line-length
import { AdditionalInsuranceDetailsComponent } from './money-in-account/additional-insurance-details/additional-insurance-details.component';
import { HealthDeclarationDetailsComponent } from './money-in-account/health-declaration-details/health-declaration-details.component';
import { VideoKycComponent } from './application-setup/video-kyc/video-kyc.component';
import { BasicDetailsTncComponent } from './application-setup/basic-details-tnc/basic-details-tnc.component';
import { EKycComponent } from './application-setup/e-kyc/e-kyc.component';
import { ImageKycComponent } from './application-setup/image-kyc/image-kyc.component';
import { EContractTncComponent } from './application-setup/e-contract-tnc/e-contract-tnc.component';
import { AutoDebitSetupComponent } from './application-setup/auto-debit-setup/auto-debit-setup.component';
import { EnachFailureDialogComponent } from './application-setup/auto-debit-setup/enach-failure/enach-failure-dialog.component';
import { AutoDebitDetailsComponent } from './application-setup/auto-debit-details/auto-debit-details.component';
import { SiMandateComponent } from './application-setup/si-mandate/si-mandate.component';
import { ConfirmationDialogComponent, DisbursalDetailsComponent } from './application-setup/disbursal-details/disbursal-details.component';
import { NetOffDialogComponent } from './application-setup/net-off-dialog/net-off-dialog.component';
import { PaymentGatewayComponent } from './application-setup/payment-gateway/payment-gateway.component';
import { MoneyInAccountComponent } from './money-in-account/money-in-account.component';
import { MaterialModulesModule } from '../shared/material-modules/material-modules.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StepWizardComponent } from './step-wizard/step-wizard.component';
import { HeaderComponent } from './header/header.component';
import { TimerPipe } from '../shared/custom-pipes/timer.pipe';
import { AutoTabDirective } from '../shared/directives/auto-tab.directive';
import { ProvideBankStatementsComponent } from './application-setup/provide-bank-statements/provide-bank-statements.component';
import { ProvideItrStatementsComponent } from './application-setup/provide-itr-statements/provide-itr-statements.component';
import { ProvideGstStatementsComponent } from './application-setup/provide-gst-statements/provide-gst-statements.component';
import { BusinessDetailsComponent } from './user-input-details/business-details/business-details.component';
import { VideoKycDialogComponent } from './application-setup/video-kyc/video-kyc-dialog/video-kyc-dialog.component';
import { WebcamModule } from 'ngx-webcam';
import { ThankyouDetailsComponent } from './money-in-account/thankyou-details/thankyou-details.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTimepickerModule } from 'mat-timepicker';
import { ProcessingDetailsComponent } from './application-setup/processing-details/processing-details.component';
import { OnlyNumbersDirective } from '../shared/directives/only-numbers.directive';
import { OnlyCharactersDirective } from '../shared/directives/only-characters.directive';
import { AlphaNumericDirective } from '../shared/directives/alpha-numeric.directive';
import { AIPLoanDetailsComponent } from './user-input-details/aip-loan-details/aip-loan-details.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { RevisitingLoanJourneyComponent } from './revisiting-loan-journey/revisiting-loan-journey.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { PaymentGatewayResultComponent } from './application-setup/payment-gateway-result/payment-gateway-result.component';
import { ResendOtpDialogComponent } from './resend-otp-dialog/resend-otp-dialog.component';
import { OfferRejectComponent } from './offer-reject/offer-reject.component';
import { BureauTncComponent } from './bureau-tnc/bureau-tnc.component';
import { FactaCrsComponent } from './facta-crs/facta-crs.component';

import { NgxLoadingModule } from 'ngx-loading';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { PrimaryAccountComponent } from './application-setup/primary-account/primary-account.component';
 
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [OffersForYouComponent,
    ApplicationSetupComponent,
    UploadBankStatementComponent,
    VerifyBankStatementComponent,
    UploadItrStatementsComponent,
    VerifyItrStatementsComponent,
    VerifyGSTComponent,
    UtilityBillDetailsComponent,
    ApprovedLoanDetailsComponent,
    LegalHeirDetailsComponent,
    AdditionalInsuranceDetailsComponent,
    HealthDeclarationDetailsComponent,
    VideoKycComponent,
    BasicDetailsTncComponent,
    EKycComponent,
    ImageKycComponent,
    EContractTncComponent,
    AutoDebitSetupComponent,
    AutoDebitDetailsComponent,
    SiMandateComponent,
    DisbursalDetailsComponent,
    NetOffDialogComponent,
    PaymentGatewayComponent,
    MoneyInAccountComponent,
    BasicDetailsComponent,
    RequirementsComponent,
    LoginComponent,
    BorrowerDetailsComponent,
    PreApprovedLoanComponent,
    UserInputDetailsComponent,
    CustomerDetailsComponent,
    EmploymentDetailsComponent,
    ErrorPageComponent,
    LoanDetailsComponent,
    StepWizardComponent,
    HeaderComponent,
    EmailDialogComponent,
    ConfirmationDialogComponent,
    TimerPipe,
    AutoTabDirective,
    ProvideBankStatementsComponent,
    ProvideItrStatementsComponent,
    ProvideGstStatementsComponent,
    BusinessDetailsComponent,
    VideoKycDialogComponent,
    ThankyouDetailsComponent,
    ProcessingDetailsComponent,
    OnlyNumbersDirective, OnlyCharactersDirective,
    AlphaNumericDirective,
    AIPLoanDetailsComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    DisclaimerComponent,
    RevisitingLoanJourneyComponent,
    PaymentGatewayResultComponent,
    ResendOtpDialogComponent,
    EnachFailureDialogComponent,
    FactaCrsComponent,
    OfferRejectComponent,
    BureauTncComponent,
    PrimaryAccountComponent,
  ],
  imports: [
    CommonModule,
    BobPlRoutingModule,
    MaterialModulesModule,
    ReactiveFormsModule,
    FormsModule,
    WebcamModule,
    AmazingTimePickerModule,
    MatMomentDateModule,
    MatTimepickerModule,
    NgxSpinnerModule,
    PdfViewerModule,
    NgxLoadingModule.forRoot({}),
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot({
      preventDuplicates: true
  })
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    EmailDialogComponent,
    VideoKycDialogComponent,
    EnachFailureDialogComponent
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },

  ],
})
export class BobPlModule { }
