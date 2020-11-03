import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { SERVER_API_URL, SERVER_API_ESTUDIANTES, SERVER_API_DOCENTES } from 'app/app.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private localStorage: LocalStorageService, private sessionStorage: SessionStorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      !request ||
      !request.url ||
      (request.url.startsWith('http') &&
        !(SERVER_API_URL && request.url.startsWith(SERVER_API_URL)) &&
        !(SERVER_API_ESTUDIANTES && request.url.startsWith(SERVER_API_ESTUDIANTES)) &&
        !(SERVER_API_DOCENTES && request.url.startsWith(SERVER_API_DOCENTES)))
    ) {
      return next.handle(request);
    }

    const token = this.localStorage.retrieve('authenticationToken') || this.sessionStorage.retrieve('authenticationToken');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
    }
    return next.handle(request);
  }
}
