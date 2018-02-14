import { Injectable } from '@angular/core';
import { Injector } from '@angular/core';
import { HttpEvent } from '@angular/common/http';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor( private _injector: Injector) {}

  intercept( req: HttpRequest<any>, next: any ): Observable<HttpEvent<any>> {
    const _authService = this._injector.get(AuthService);
    const token = _authService.getToken();
    if (_authService.logged && token !== null) {
      const copiedReq = req.clone({
        headers: req.headers.set(
          'Authorization', 'Token ' + token
        )
      });
      return next.handle(copiedReq);
    } else {
      return next.handle(req);
    }
  }
}
