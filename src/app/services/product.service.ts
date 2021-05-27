import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient, private msgService: MessageService) {}

  getProducts() {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const url = `${environment.apiUrl}/products`;
    return this.http.get(url, { headers }).pipe(
      map((result: any) => {
        return result;
      }),
      catchError((result: any) => {
        this.msgService.errorAlert(result.message);
        console.log(result);
        return of(0);
      })
    );
  }

  createProduct(product: Product) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const url = `${environment.apiUrl}/products`;
    return this.http.post(url, JSON.stringify(product), { headers }).pipe(
      map((result: any) => {
        this.msgService.successToast(result.message);
      }),
      catchError((result) => {
        this.msgService.errorAlert(result.message);
        console.log(result.message);
        return of(0);
      })
    );
  }

  updateProduct(product: Product) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const url = `${environment.apiUrl}/products/${product.IdProduct}`;
    return this.http.put(url, JSON.stringify(product), { headers }).pipe(
      /* map((result: any) => {
        this.msgService.successToast(result.message);
      }), */
      catchError((result) => {
        this.msgService.errorAlert(result.message);
        console.log(result.message);
        return of(0);
      })
    );
  }
}
