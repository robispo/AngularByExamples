import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:58746/api/auth/';
  userToken: any;
  decodedToken: any;

  constructor(private http: Http, private jwtHelper: JwtHelperService) {}

  private requestOptions() {
    const headers = new Headers({ 'Content-type': 'application/json' });
    return new RequestOptions({ headers: headers });
  }

  private handleError(error: any) {
    const applicationError = error.headers.get('Application-Error');

    if (applicationError) {
      return Observable.create(observer => {
        observer.error(applicationError);
      });
    }

    const serverError = error.json();
    let modelStateErrors = '';

    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }

    return Observable.create(observer => {
      observer.error(modelStateErrors || 'Server error');
    });
  }

  login(model: any) {
    return this.http
      .post(this.baseUrl + 'login', model, this.requestOptions())
      .pipe(
        map((response: Response) => {
          const user = response.json();
          if (user) {
            localStorage.setItem('token', user.tokenString);
            this.userToken = user.tokenString;
            this.decodedToken = this.jwtHelper.decodeToken(this.userToken);
            console.log(this.decodedToken);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(model: any) {
    return this.http
      .post(this.baseUrl + 'register', model, this.requestOptions())
      .pipe(catchError(this.handleError));
  }

  loggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }
}
