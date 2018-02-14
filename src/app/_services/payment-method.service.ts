import { API_URL } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { Sort } from '@angular/material';

import { PaymentMethod } from '../_model/index';


@Injectable()
export class PaymentMethodService {

  URL = `${API_URL}sale/paymentmethod/`;

  constructor(private _http: HttpClient) { }

  getAll (limit: number, offset: number): Observable<any> {

    let query = '';

    if (limit !== null && offset !== null) {
      query += `?limit=${limit}&offset=${offset}`;
    }

    const url = this.URL + query;
    return this._http.get(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: get ${url}`)),
      catchError(this.handleError(`${this.constructor.name}: get ${url}`))
    );
  }

  get(id: string): Observable<PaymentMethod> {
    const url = `${this.URL}${id}/`;
    return this._http.get<PaymentMethod>(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: get ${url}`)),
      catchError(this.handleError<PaymentMethod>(`${this.constructor.name}: get ${url}`))
    );
  }

  save(paymentMethod: PaymentMethod) {
    let url: string;
    const body = paymentMethod;

    if (paymentMethod.id === undefined) {
       url = `${this.URL}`;
       return this._http.post(url, body)
       .pipe(
         tap(_ => console.log(`${this.constructor.name}: post ${url} body=${body}`)),
         catchError(this.handleError(`${this.constructor.name}: post ${url} body=${body}`))
       );
    }else {
       url = `${this.URL}${paymentMethod.id}/`;
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

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return Observable.of(error);
    };
  }

}
