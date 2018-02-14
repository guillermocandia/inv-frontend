import { API_URL } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';

// import { Sort } from '@angular/material';

import { Sale } from '../_model/index';


@Injectable()
export class SaleService {

  URL = `${API_URL}sale/`;

  constructor(private _http: HttpClient) { }

  getAll (limit: number, offset: number, date_gte?: Date|null, date_lte?: Date|null,
     active?: boolean|null, paymentmethod?: string|null): Observable<any> {

    let query = `?limit=${limit}&offset=${offset}`;

    if (date_gte !== null) {
      query += `&date__gte=${date_gte.toISOString()}`;
    }

    if (date_lte !== null) {
      const aux = new Date(date_lte);
      aux.setDate(aux.getDate() + 1);
      query += `&date__lte=${aux.toISOString()}`;
    }

    if (active !== undefined && active !== null) {
      query += `&active=${active}`;
    }

    if (paymentmethod !== null) {
      query += `&paymentmethod=${paymentmethod}`;
    }

    const url = this.URL + query;
    return this._http.get(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: get ${url}`)),
      catchError(this.handleError(`${this.constructor.name}: get ${url}`))
    ).map(data => {
        for (const sale of data['results']) {
          sale.date = new Date(sale.date);
        }
        return data;
      }
    );
  }

  get(id: string): Observable<Sale> {
    const url = `${this.URL}${id}/`;
    return this._http.get<Sale>(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: get ${url}`)),
      catchError(this.handleError<Sale>(`${this.constructor.name}: get ${url}`))
    ).map(data => {
        data.date = new Date(data.date);
        return data;
      }
    );
  }

  invalidate(sale: Sale) {
    let url: string;
    const body = {
      active: false
    };

   url = `${this.URL}active/${sale.id}/`;
     return this._http.put(url, body)
     .pipe(
       tap(_ => console.log(`${this.constructor.name}: put ${url} body=${body}`)),
       catchError(this.handleError(`${this.constructor.name}: put ${url} body=${body}`))
     );

  }

  save(sale: Sale) {
    const url = this.URL;
    const body = sale;

    if (sale === undefined || sale === null) {
       return Observable.of(null);
    }
       return this._http.post(url, body)
       .pipe(
         tap(_ => console.log(`${this.constructor.name}: post ${url} body=${body}`)),
         catchError(this.handleError(`${this.constructor.name}: post ${url} body=${body}`))
       );
    }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return error;
    };
  }

}
