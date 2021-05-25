import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Order } from '../models/order';
import { OrderDetail } from '../models/orderdetail';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  constructor(private http: HttpClient, private msgService: MessageService) {}

  getOrdersDetailByOrder(idOrder: number) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const url = `${environment.apiUrl}/ordersdetail/order/${idOrder}`;
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

  createOrderDetail(orderDetail: OrderDetail) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const url = `${environment.apiUrl}/ordersdetail`;
    return this.http.post(url, JSON.stringify(orderDetail), { headers }).pipe(
      catchError((result) => {
        this.msgService.errorAlert(result.message);
        console.log(result.message);
        return of(0);
      })
    );
  }

  deleteOrderDetailByOrder(id: number) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const url = `${environment.apiUrl}/ordersdetail/order/${id}`;
    return this.http.delete(url, { headers }).pipe(
      catchError((result) => {
        this.msgService.errorAlert(result.message);
        console.log(result.message);
        return of(0);
      })
    );
  }
}
