import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable()
export class DocumentsService {

    documents: any;
    allowedFiles: any[];
    commonStrings: any;

    constructor(private http: HttpClient) {

        this.allowedFiles = ['pdf', 'png', 'jpeg', 'jpg'];

        this.commonStrings = {
            http_error: "Oh Oh! This is taking longer than expected Slow or No Internet Connection. Please check your internet settings. You may refresh or log in again with your registered mobile number to resume your journey",
            file_size: "Please select the file to upload smaller than ",
            file_extention: "Please select the file format as pdf, png, jpeg, or jpg"
        }
    }

    validateFileToUpload(files, fileSizeLimit) {
        if (!files[0]) {
            return false;
        }

        let fileSize = files[0].size / 1000000;
        let extention = files[0].name.split('.').pop().toLowerCase();

        if (fileSize > fileSizeLimit) {
            return this.commonStrings.file_size + fileSizeLimit + 'MB';
        } else if (this.allowedFiles.indexOf(extention) == -1) {
            return this.commonStrings.file_extention;
        }
        return false;
    }

    getBase64File(file) {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = (e) => {
                let reader: any = e.target;
                resolve(reader.result);
            }
            reader.readAsDataURL(file);
        });
    }

    // request Headers
    globalHeader(token) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Constant-Type': 'application/json' }).
                set('Authorization', 'Bearer ' + token).set('Content-Type', 'application/json')
        };
        return httpOptions;
    }

    uploadFile(fileToUpload: File, bsmetadata, token) {
        let formData = new FormData();
        formData.append('bsmetadata', JSON.stringify(bsmetadata));
        formData.append('inputFile', fileToUpload);

        const url = environment.JocataServer + 'perfios/upload-statement';

        const httpOptions = {
            headers: new HttpHeaders().set("Authorization", "Bearer " + token).set('formData', 'formData')
        }
        return this.http.post(url, formData, httpOptions);
    }

    uploadGstFile(fileToUpload: File, gstmetadata, token) {
        let formData = new FormData();
        formData.append('gstmetadata', JSON.stringify(gstmetadata));
        formData.append('inputFile', fileToUpload);

        const url = environment.JocataServer + "perfios/gst-upload-perfios";

        const httpOptions = {
            headers: new HttpHeaders().set("Authorization", "Bearer " + token).set('formData', 'formData')
        }
        return this.http.post(url, formData, httpOptions);
    }

    uploadItrFile(fileToUpload: File, itrmetadata, token) {
        let formData = new FormData();
        formData.append('metadata', JSON.stringify(itrmetadata));
        formData.append('inputFile', fileToUpload);

        const url = environment.JocataServer + "dms/upload";

        const httpOptions = {
            headers: new HttpHeaders().set("Authorization", "Bearer " + token).set('formData', 'formData')
        }
        return this.http.post(url, formData, httpOptions);
    }

    downloadFileToBrowser(fileResp) {
        if (fileResp && fileResp.file) {
            if (navigator.msSaveBlob) { // IE 10+ 
                navigator.msSaveBlob(this.b64toBlob(fileResp.file, fileResp.mimeType), fileResp.fileName);
            } else {
                const blob = this.b64toBlob(fileResp.file, fileResp.mimeType);
                const url = window.URL.createObjectURL(blob);
                const element = document.createElement('a');

                element.setAttribute('href', url);
                element.setAttribute('download', fileResp.fileName);

                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                //window.URL.revokeObjectURL(url);
            }
        }
    }

    b64toBlob(b64Data, contentType) {
        contentType = contentType;
        let sliceSize = 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

}
