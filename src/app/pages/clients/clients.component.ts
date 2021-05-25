import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Client } from 'src/app/models/client';
import { ClientService } from 'src/app/services/client.service';

import * as moment from 'moment';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styles: [],
})
export class ClientsComponent implements OnInit {
  @ViewChild('gForm') gForm: NgForm;

  constructor(private clientService: ClientService) {}

  now: string = moment().format('YYYY-MM-DD HH:mm');
  clients: Client[] = [];
  client: Client = new Client(0,'','', this.now, this.now);

  ngOnInit(): void {
    this.getClients();
  }

  getClients() {
    this.clientService.getClients().subscribe((result: any) => {
      this.clients = result.data;
    });
  }

  async createClient() {
    await this.clientService.createClient(this.client).toPromise();
    this.reset();
  }

  reset() {
    this.client = new Client(0,'','', this.now, this.now);
    this.gForm.form.markAsPristine();
    this.gForm.form.markAsUntouched();
    this.getClients();
  }
}
