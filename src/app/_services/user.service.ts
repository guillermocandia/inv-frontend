import { API_URL } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { Sort } from '@angular/material';

import { User } from '../_model/index';


@Injectable()
export class UserService {

  URL = `${API_URL}user/`;

  constructor(private _http: HttpClient) { }

  getAll (limit: number, offset: number): Observable<any> {
    let query = '?';

    if (query !== null && offset !== null) {
      query += `limit=${limit}&offset=${offset}`;
    }

    const url = this.URL + query;
    return this._http.get(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: get ${url}`)),
      catchError(this.handleError(`${this.constructor.name}: get ${url}`))
    );
  }

  get(id: string): Observable<User> {
    const url = `${this.URL}${id}/`;
    return this._http.get<User>(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: get ${url}`)),
      catchError(this.handleError<User>(`${this.constructor.name}: get ${url}`))
    );
  }

  save(user: User) {
    let url: string;
    const body = {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      is_superuser: user.is_superuser,
      is_staff: user.is_staff,
      is_active: user.is_active
    };

    if (user.id === undefined) {
       url = `${this.URL}`;
       return this._http.post(url, body)
       .pipe(
         tap(_ => console.log(`${this.constructor.name}: post ${url} body=${body}`)),
         catchError(this.handleError(`${this.constructor.name}: post ${url} body=${body}`))
       );
    }else {
       url = `${this.URL}${user.id}/`;
       return this._http.put(url, body)
       .pipe(
         tap(_ => console.log(`${this.constructor.name}: post ${url} body=${body}`)),
         catchError(this.handleError(`${this.constructor.name}: post ${url} body=${body}`))
       );
    }
  }

  delete(id: string) {
    const url = `${this.URL}${id}/`;
    return this._http.delete(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: delete ${url}`)),
      catchError(this.handleError(`${this.constructor.name}: delete ${url}`))
    );
  }

  updatePassword(id: string, password_new: string) {
    const url = `${this.URL}password/${id}/`;

    const body = {
      password_new: password_new
    };

    return this._http.put(url, body)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: post ${url}`)),
      catchError(this.handleError<any>(`${this.constructor.name}: post ${url}`))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      // return Observable.of(error); // TODO si se return un obsevable el error no es procesado por la subscripción
      return error;
    };
  }

}
