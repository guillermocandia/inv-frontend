import { API_URL } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { UserLogin } from '../_model/index';
import { User } from '../_model/index';

@Injectable()
export class AuthService {
  URL = API_URL;

  private _logged = new BehaviorSubject<boolean>(false);
  logged$ = this._logged.asObservable();

  private user: User;

  private token: string;
  public redirectUrl = '/';

  constructor(private _http: HttpClient,
              private _router: Router) { }

  public get logged(): boolean {
    this.token = localStorage.getItem('token');
    if (this.token !== null) {
      this._logged.next(true);
    } else {
      this._logged.next(false);
    }
    return this._logged.getValue();
  }

  public set logged(value: boolean) {
    if (value === false) {
      localStorage.removeItem('token');
      this._logged.next(false);
    } else {
      this.token = localStorage.getItem('token');
      this._logged.next(true);
    }
  }

  getToken () {
    return this.token;
  }

  login(arg0: UserLogin|string, arg1?: string): any {
    const url = `${this.URL}auth/`;
    let body: any;
    if (arg1 === undefined && (arg0 instanceof UserLogin)) {
      body = arg0;
    } else {
      body = {username: arg0, password: arg1};
    }

    return this._http.post<any>(url, body)
    .map(
      (data) => {
        if (data && data.token) {
          localStorage.setItem('token', data.token);
          this.logged = true;
          console.log(data.token); // TODO
          this._router.navigate([this.redirectUrl]);
        }
      })
      .catch(
        error => {
          console.log(error); // TODO Hacer que este servivio se parezca al de categorias
          return null; // TODO bsucar que responder en forma correcta
        }
      );
    }

    logout() {
      const url = `${this.URL}logout/`;

      const headers = new HttpHeaders({ 'Authorization': 'Token ' + this.token });
      localStorage.removeItem('token');
      this.token = undefined;
      this._http.get(url, { headers })
        .subscribe(
           function(response) {
             location.reload();
           }, error => {
             console.log(error); // TODO mensaje de exito
             location.reload();
           }
        );
    }


    checkToken(): Observable<User> {
      const url = `${this.URL}check-token/`;

      if (this.token === null) {
        console.log(`${this.constructor.name}: Token ${this.token}`);
        return Observable.of(null);
      }

      const headers = new HttpHeaders({ 'Authorization': 'Token ' + this.token });
      return this._http.get<User>(url, { headers })
      .pipe(
        tap(_ => {
          this.user = _;
          console.log(`${this.constructor.name}: get ${url}`);
      }),
        catchError(this.handleError<User>(`${this.constructor.name}: get ${url}`))
      );
    }

    getUser() {
      return this.user;
    }

    private handleError<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.error(error);
        console.log(`${operation} failed: ${error.message}`);
        // return Observable.of(error);
        return error;
      };
    }
  }
