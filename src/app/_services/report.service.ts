import { API_URL } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';


@Injectable()
export class ReportService {

  URL = `${API_URL}report/sale/`;

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
