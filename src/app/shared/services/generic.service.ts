import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  constructor(private http: HttpClient) { }

  // to get token
  getToken() {
    const url = environment.JocataServer + 'um/service/user-token?panCard=token';
    return this.http.get(url);
  }

  // request Headers
  globalHeader(token) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Constant-Type': 'application/json' }).
        set('Authorization', 'Bearer ' + token).set('Content-Type', 'application/json')
    };
    return httpOptions;
  }

  // lookUp apis
  getLookUpValues(data, token) {
    const url = environment.JocataServer + 'dlp/get-lookup';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }
  //child lookups
  getLookupChildValues(data, token) {
    const url = environment.JocataServer + "dlp/lookupservice/lookup-child-values";
    let body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //pan varification
  panService(data, token) {
    const url = environment.JocataServer + 'dlp/panDetails?panNumber=' + data;
    const body = JSON.stringify(data);
    return this.http.get(url, this.globalHeader(token));
  }

  // requirements apis
  getRequirements(token) {
    const url = environment.JocataServer + 'dlp/fetchApplicationById/showBOBPrerequisite';
    return this.http.post(url, this.globalHeader(token));
  }

  // login apis
  generateOTP(data, token) {
    const url = environment.JocataServer + 'dlp/sendNotification/generateOtp';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  validateOTP(data, token) {
    const url = environment.JocataServer + 'dlp/sendNotification/validateOtp';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }



  // borrower apis
  getBorrowerOTP(data, token) {
    const url = environment.JocataServer + 'dlp/aadhaar/otp';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getCustIds(data, token) {
    const url = environment.JocataServer + 'dlp/aadhaar/custIds';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  verifyBorrowerOTP(data, token) {
    const url = environment.JocataServer + 'dlp/aadhaar/verifyOtp';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  ekycSendOtp(data, token) {
    const url = environment.JocataServer + 'dlp/aadhaar/sendOtpEKYC';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  ekycVerifyOtp(data, token) {
    const url = environment.JocataServer + 'dlp/aadhaar/verifyOtpEKYC';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }
  // customer-details
  getCustomerDetails(data, token) {
    const url = environment.JocataServer + 'dlp/bob/get-customer-details';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  savecustomerDetails(data, token) {
    const url = environment.JocataServer + 'dlp/bob/saveNewApplication';
    // const body = JSON.stringify(data);
    return this.http.post(url, data, this.globalHeader(token));
  }

  getPreferredBranchDetails(data, token) {
    const url = environment.JocataServer + 'dlp/branch/getPreferredBranchDetails';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  // employment-details
  saveEmploymentDetails(data, token) {
    const url = environment.JocataServer + 'dlp/employmentDetails';
    return this.http.post(url, data, this.globalHeader(token));
  }

  getEmploymentDetails(data, token) {
    const url = environment.JocataServer + 'dlp/getemploymentDetails';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getsameAddressDetails(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getAddressDetailsByIdAndType';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getStateandCityByPincode(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getStateAndCityByPincode';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  validateEmployeeId(data, token) {
    const url = environment.JocataServer + 'dlp/occupation/verifyAffiliation';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  // loan-details
  getLoanRequirements(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getLoanRequirement';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //aip-loan-deatils
  getAipDetails(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getaipLoanDetails';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getOfferDetails(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getOfferDetails';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  saveOfferDetails(data, token) {
    const url = environment.JocataServer + 'dlp/bob/saveOfferDetails';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  saveLoanRequirements(data, token) {
    const url = environment.JocataServer + 'dlp/bob/saveLoanRequirement';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  // provide-bank-statements
  netBankingPerfiosLogin(data, token) {
    const url = environment.JocataServer + 'perfios/perfiosLogin';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getPerfiosTransAccountDtls(data, token) {
    console.log(data);

    const url = environment.JocataServer + 'perfios/getPerfiosTransAccountDtls' + "?applicationId=" + data.applicationId + '&isPerfiosCallback=' + data.id;
    const body = JSON.stringify(data);
    return this.http.get(url, this.globalHeader(token));
  }

  savePerfiosPrimaryAccountDtls(data, token) {
    const url = environment.JocataServer + 'perfios/savePerfiosPrimaryAccountDtls';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //upload-bank-statements
  uploadBankStatements(bsmetadata, inputFile, token) {
    let formData = new FormData();
    formData.append('bsmetadata', JSON.stringify(bsmetadata));
    formData.append('inputFile', JSON.stringify(inputFile));

    const url = environment.JocataServer + 'perfios/upload-statement';

    const httpOptions = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token).set('formData', 'formData')
    }
    return this.http.post(url, formData, httpOptions);
  }

  //e-contract
  getESignDocument(data, token) {
    const url = environment.JocataServer + 'dlp/Esign/getESignDocument';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  eSignCreation(data, token) {
    const url = environment.JocataServer + 'dlp/Esign/createEsign';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  eSignStatus(data, token) {
    const url = environment.JocataServer + 'dlp/Esign/checkIsEsigned';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  // image-kyc
  uploadSelfie(imageFile, appId, token) {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("applicationId", appId);

    const url = environment.JocataServer + 'dlp/upload-customer-selfie';
    const httpOptions = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token).set('formData', 'formData')
    }
    return this.http.post(url, formData, httpOptions);
  }

  getSelfie(data, token) {
    const url = environment.JocataServer + 'dlp/download-customer-selfie';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getCustomerStatus(data, token) {
    const url = environment.JocataServer + 'dlp/bob/get-customer-common-data';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //Video Kyc
  videoKyc(data, token) {
    const url = environment.JocataServer + 'vkyc/push';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }


  transactionStatus(data, token) {
    const url = environment.JocataServer + 'banking/transactionStatus';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  submitOTP(data, token) {
    const url = environment.JocataServer + 'dlp/aadhaar/verifyOtp';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  submitBasicDetailsTnc(basicDetailsTnc) {
    const url = environment.JocataServer + 'dlp/aadhaar/test';
    return this.http.post(url, basicDetailsTnc, )
  }

  customerDecision(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getLoanCustomerDecision';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //Utility bill
  uplaodUtilityBill(data, token) {
    const url = environment.JocataServer + 'dlp/utility/utilityBill';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //approved loan Details 
  approvedLoanDetails(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getApprovedLoanDetails';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //disbursal screen
  gettingDisbursalData(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getLoanDisbursalDetails';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }
  saveDisbursalData(data, token) {
    const url = environment.JocataServer + 'dlp/bob/saveDisbursmentData';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //disbursal popup
  gettingDisbursalNumber(data, token) {
    const url = environment.JocataServer + 'dlp/getMessageFromTMS';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }


  confirmDisbursalStatus(data, token) {
    const url = environment.JocataServer + 'dlp/confirmDisbursalStatus';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //thankyou  (not in use. )
  // gettingThankyouData(data, token) {
  //   const url = environment.JocataServer + 'dlp/gettingThankyouData';
  //   const body = JSON.stringify(data);
  //   return this.http.post(url, body, this.globalHeader(token));
  // }

  getEMandateDetails(data, token) {
    const url = environment.JocataServer + 'dlp/initiateTransactionRequest';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getSiMandateDetails() {
    return this.http.get(environment.JocataServer + 'banking/getSiMandateDetails');
  }

  saveMandateRegistration(data, token) {
    const url = environment.JocataServer + 'dlp/bob/mandateRegistration';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //auto-debit-details
  getMandateDetails(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getMandateRegistration';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getUtilityBillDetails(data, token) {
    const url = environment.JocataServer + 'dlp/utility/getUtilityBillDetails';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  saveLegalHeirDetails(data, token) {
    const url = environment.JocataServer + 'dlp/bob/saveLegalInformation';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getLegalHeirDetails(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getLegalInformation';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  gstUploadStatement(bsmetadata, inputFile, token) {
    let formData = new FormData();
    formData.append('gstmetadata', JSON.stringify(bsmetadata));
    formData.append('inputFile', JSON.stringify(inputFile));

    const url = environment.JocataServer + "perfios/gst-upload-perfios";

    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token).set('formData', 'formData')
    }
    return this.http.post(url, formData, httpOptions);
  }

  getGstinDetails(data, token) {
    const url = environment.JocataServer + "itr/find-all-gstin";
    let body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getGstOtp(data, token) {
    const url = environment.JocataServer + 'itr/get-otp-gstswara';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  validateGstOtp(data, token) {
    const url = environment.JocataServer + 'itr/verify-otp-gstswara';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  itrOnline(data, token) {
    const url = environment.JocataServer + 'itr/itrOnline';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  uploadItr(data, inputFile, token) {
    let postData = {
      multipartfile: inputFile,
      appId: data.appId,
      fileType: data.fileType,
      itrYear: data.itrYear
    }

    const url = environment.JocataServer + 'itr/itr/uploaditr';

    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token).set('formData', 'formData')
    }
    return this.http.post(url, postData, httpOptions);
  }

  itrUpload(data, token) {
    const url = environment.JocataServer + 'itr/itrUpload';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getDMSDocumentDtls(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getDMSDocumentDtls';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getPerfiosStatus(data, token) {
    const url = environment.JocataServer + 'itr/get-perfios-status';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getEmandateDetails(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getMandateRegistrationData';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  initiateEnachRequest(data, token) {
    const url = environment.JocataServer + 'dlp/enachDetails/initiateEnachRequest';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  initiateTransactionRequest(data, token) {
    const url = environment.JocataServer + 'dlp/initiateTransactionRequest';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  mandateDetails(data, token) {
    const url = environment.JocataServer + 'dlp/bob/getMandateRegistrationDetails';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  mandateRegistration(data, token) {
    const url = environment.JocataServer + 'dlp/bob/mandateRegistration';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //payment-gateway
  paymentGateway(data, token) {
    const url = environment.JocataServer + 'dlp/paymentGateway/processPayment';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));

  }

  getPatmentGatewayStatus(data, token) {
    const url = environment.JocataServer + 'dlp/paymentGateway/get-payment-gateway-status';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //Terms and conditions
  termsAndConditions(data, token) {
    const url = environment.JocataServer + 'dlp/getMessageFromTMS';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getSanctionLetter(data, token) {
    const url = environment.JocataServer + 'dlp/generatePDF';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  // getSanctionOtp(data, token) {
  //   const url = environment.JocataServer + 'dlp/sendNotification/sanctionOtp';
  //   const body = JSON.stringify(data);
  //   return this.http.post(url, body, this.globalHeader(token));
  // }

  // validateSanctionOtp(data, token) {
  //   const url = environment.JocataServer + 'dlp/sanctionValidateOtp';
  //   const body = JSON.stringify(data);
  //   return this.http.post(url, body, this.globalHeader(token));
  // }

  //emailVerification

  getEmailVerification(data, token) {
    const url = environment.JocataServer + 'dlp/email/getEmailVerified';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  emailVerificationStatus(data, token) {
    const url = environment.JocataServer + 'dlp/get-employee-verified-flag';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  //errorPage

  getErrorPageDetails(data, token) {
    const url = environment.JocataServer + 'dlp/getMessageFromTMS';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  validUtility(data, token) {
    const url = environment.JocataServer + 'dlp/verifyUtilityDetails';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));

  }

  saveCustomerScreenData(data, token) {
    const url = environment.JocataServer + 'dlp/bob/save-customer-screen';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getNameofEmployeer(data, token) {
    const url = environment.JocataServer + 'dlp/bob/search-employer-by-name';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  getCustomerScreen(data, token) {
    const url = environment.JocataServer + "dlp/bob/get-customer-screen";
    let body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  // primary account screen

  getPrimaryAccountDetails(data, token) {
    const url = environment.JocataServer + 'dlp/customer/accounts/getCustomerAccountDetails';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }

  savePrimaryAccountDetails(data, token) {
    const url = environment.JocataServer + 'dlp/customer/accounts/saveCustomerAccountDetails';
    const body = JSON.stringify(data);
    return this.http.post(url, body, this.globalHeader(token));
  }


}
