import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Client } from '../models/client';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  constructor(
    private http: HttpClient,
    private msgService: MessageService
    ) {}

  getClients() {
    const headers = new HttpHeaders({'content-type': 'application/json'});
    const url = `${environment.apiUrl}/clients`;
    return this.http.get(url, {headers}).pipe(
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
    
    createClient(client: Client) {
      const headers = new HttpHeaders({'content-type': 'application/json'});
      const url = `${environment.apiUrl}/clients`;
      return this.http.post(url, JSON.stringify(client), {headers}).pipe(
        map((result: any) => {
          this.msgService.successToast(result.message);
        }),
        catchError(result => {
        this.msgService.errorAlert(result.message);
        console.log(result.message);
        return of(0);
      })
    );
  }
}
