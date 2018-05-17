import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    baseUrl = 'http://localhost:58746/api/auth/';
    userToken: any;

constructor(private http: Http) { }

private requestOptions() {
  const headers = new Headers({'Content-type': 'application/json'});
  return new RequestOptions({headers: headers});
}

login(model: any) {
    return this.http.post(this.baseUrl + 'login', model, this.requestOptions()).pipe(map((response: Response) => {
        const user = response.json();
        if (user) {
            localStorage.setItem('token', user.tokenString);
            this.userToken = user. tokenString;
        }
    }));
}

register(model: any) {
  return this.http.post(this.baseUrl + 'register', model, this.requestOptions());
}

}
