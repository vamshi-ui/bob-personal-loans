import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from 'rxjs'
import { InjectableCompiler } from '@angular/compiler/src/injectable_compiler';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'

@Injectable()
export class BobInterceptor implements HttpInterceptor {
    appUrl = environment.JocataServer
    constructor(private route: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = localStorage.getItem('token');
        if (user) {
            const cloned = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + user) })
            return next.handle(cloned);

        } else if (request.url == `${this.appUrl}um/service/sysadmin-token`) {
            return next.handle(request);
        } else {
            this.route.navigate(['/'])

            // return next.handle(request);
        }
    }
}
