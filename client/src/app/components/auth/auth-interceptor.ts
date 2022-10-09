import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';

interface AccessResponse {
  ok: boolean;
  accessToken: string;
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  readonly REFRESH_URL = `${environment.SERVER_DOMAIN}/auth/refresh_token`;
  isAccessValid = false;

  constructor(private http: HttpClient, private authService: AuthService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.getAccessToken();

    if (accessToken || accessToken !== null) {
      const req = request.clone({
        setHeaders: {
          authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      return next.handle(req).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 403 || err.status == 401) {
            this.isAccessValid = true;
            return this.http
              .get<AccessResponse>(this.REFRESH_URL, {
                withCredentials: true,
              })
              .pipe(
                switchMap((res) => {
                  this.authService.setAccessToken(res.accessToken);
                  return next.handle(
                    request.clone({
                      setHeaders: {
                        Authorization: `Bearer ${res.accessToken}`,
                        'Access-Control-Allow-Headers': 'authorization',
                      },
                      withCredentials: true,
                    })
                  );
                })
              ) as Observable<HttpEvent<any>>;
          }
          this.isAccessValid = false;
          return throwError(() => err);
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
