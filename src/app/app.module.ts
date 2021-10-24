import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModulesModule } from './shared/material-modules/material-modules.module';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { BnNgIdleService } from 'bn-ng-idle';
import { IdleTimeComponent } from './idle-time/idle-time.component';
import { PageReloadComponent } from './page-reload/page-reload.component';
import { GenericService } from './shared/services/generic.service';
import { DocumentsService } from './shared/services/documents-service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BobInterceptor } from './shared/helpers/bob.interceptor';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule, IConfig } from 'ngx-mask';
 
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


@NgModule({
    declarations: [AppComponent, IdleTimeComponent, PageReloadComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModulesModule,
        BackButtonDisableModule.forRoot({
          preserveScrollPosition: true
        }),
        HttpClientModule,
        NgxSpinnerModule,
        NgxMaskModule.forRoot(),
        ToastrModule.forRoot({
            preventDuplicates: true
        })
    ],
    entryComponents: [
        IdleTimeComponent,
        PageReloadComponent
    ],
    exports: [],
    providers: [
        DatePipe,
        BnNgIdleService,
        GenericService,
        DocumentsService,
        // {provide:HTTP_INTERCEPTORS,useClass:BobInterceptor,multi:true},
    ],
    bootstrap: [
        AppComponent
    ],
})

export class AppModule { }
