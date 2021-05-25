import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ClientsComponent } from './clients/clients.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component'


@NgModule({
  declarations: [
    ClientsComponent,
    ProductsComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ClientsComponent,
    ProductsComponent,
    OrdersComponent
  ]
})
export class PagesModule { }
