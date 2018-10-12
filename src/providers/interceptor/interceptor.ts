import { AlertController } from 'ionic-angular';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import { AuthServiceProvider } from '../auth-service/auth-service';


@Injectable()
export class InterceptorProvider implements HttpInterceptor {
 
    constructor( private alertCtrl: AlertController, public authService: AuthServiceProvider) { }
 
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).do((event: HttpEvent<any>) => {}, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if(err.status != 401) {
                let alert = this.alertCtrl.create({
                    title: "Un erreur s'est produite ",
                    buttons: ['OK']
                    });
                alert.present();
                this.authService.hideLoading();
            }
            
          }
        });
      }

}