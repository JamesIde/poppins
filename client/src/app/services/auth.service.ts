import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginUser, RegisterUser, User } from '../types/user-interface';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  loggedUser = new BehaviorSubject<User>(null);
  /* Authentication routes */
  loginUser(user: LoginUser): Observable<User> {
    return this.http
      .post<User>(`${environment.SERVER_DOMAIN}/auth/login`, user, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': `${environment.CLIENT_DOMAIN}`,
        },
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        }),
        tap((user) => {
          this.handleAuthResponse(user);
        })
      );
  }

  registerUser(user: RegisterUser): Observable<User> {
    return this.http
      .post<User>(`${environment.SERVER_DOMAIN}/auth/register`, user, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': `${environment.CLIENT_DOMAIN}`,
        },
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        }),
        tap((user) => {
          this.handleAuthResponse(user);
        })
      );
  }

  autoLogin(): User {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      this.loggedUser.next(user);
    }
    return user;
  }

  /* Auth handlers */

  handleLogout() {
    this.loggedUser.next(null);
    localStorage.removeItem('user');
  }

  handleAuthResponse(user: User) {
    // Emits the value to all subscribers to the loggedUser subject
    this.loggedUser.next(user);
    // TODO change to session storage once http interceptors
    localStorage.setItem('user', JSON.stringify(user));
  }

  /* Profile getter */
  // TODO Add user profile type (reviews and orders)
  getProfile(): Observable<any> {
    return this.http
      .get<User>(`${environment.SERVER_DOMAIN}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': `${environment.CLIENT_DOMAIN}`,
          Authorization: `Bearer ${this.loggedUser.value.accessToken}`,
        },
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
