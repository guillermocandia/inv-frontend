import { API_URL } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { Sort } from '@angular/material';

import { Item } from '../_model/index';


@Injectable()
export class ItemService {

  URL = `${API_URL}inventory/item/`;

  constructor(private _http: HttpClient) { }

  getAll (limit: number, offset: number, search?: string|null, sort?: Sort|null,
     category?: string|null, brand?: string|null): Observable<any> {

    let query = '';

    if (limit !== null && offset !== null) {
      query += `?limit=${limit}&offset=${offset}`;
    }

    if (search !== null && search !== '') {
      query += `&search=${search}`;
    }

    if (sort !== null && sort.direction !== '') {
      query += `&ordering=${sort.direction === 'desc' ? '-' : ''}${sort.active}`;
    }

    if (category !== null && category !== '' ) {
      query += `&category=${category}`;
    }

    if (brand !== null && brand !== '' ) {
      query += `&brand=${brand}`;
    }

    const url = this.URL + query;
    return this._http.get(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: get ${url}`)),
      catchError(this.handleError(`${this.constructor.name}: get ${url}`))
    );
  }

  get(id: string): Observable<Item> {
    const url = `${this.URL}${id}/`;
    return this._http.get<Item>(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: get ${url}`)),
      catchError(this.handleError<Item>(`${this.constructor.name}: get ${url}`))
    );
  }

  save(item: Item) {
    let url: string;
    const body = {
      name: item.name,
      price: item.price,
      bar_code: item.bar_code,
      packaging: item.packaging,
      stock: item.stock,
      comment: item.comment,
      stock_min: item.stock_min,
      active: item.active,
      brand: item.brand,
      category: item.category
    };

    if (item.id === undefined) {
       url = `${this.URL}`;
       return this._http.post(url, body)
       .pipe(
         tap(_ => console.log(`${this.constructor.name}: post ${url} body=${body}`)),
         catchError(this.handleError(`${this.constructor.name}: post ${url} body=${body}`))
       );
    }else {
       url = `${this.URL}${item.id}/`;
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
      // return Observable.of(error);
      return error;
    };
  }

}
