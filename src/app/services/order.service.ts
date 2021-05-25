import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Order } from '../models/order';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private msgService: MessageService) {}

  getOrders() {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const url = `${environment.apiUrl}/orders`;
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

  createOrder(order: Order) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const url = `${environment.apiUrl}/orders`;
    return this.http.post(url, JSON.stringify(order), { headers }).pipe(
      map((result: any) => {
        return result;
      }),
      catchError((result) => {
        this.msgService.errorAlert(result.message);
        console.log(result.message);
        return of(0);
      })
    );
  }

  updateOrder(order: Order) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const url = `${environment.apiUrl}/orders/${order.IdOrder}`;
    return this.http.put(url, JSON.stringify(order), { headers }).pipe(
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

  deleteOrder(id: number) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const url = `${environment.apiUrl}/orders/${id}`;
    return this.http.delete(url, { headers }).pipe(
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
}
