import { Component, OnInit, ViewChild } from '@angular/core';

import { Client } from 'src/app/models/client';
import { Product } from 'src/app/models/product';
import { ClientService } from 'src/app/services/client.service';
import { ProductService } from 'src/app/services/product.service';

import * as moment from 'moment';
import { Order } from 'src/app/models/order';
import { OrderDetail } from 'src/app/models/orderdetail';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailService } from 'src/app/services/orderdetail.service';
import { MessageService } from 'src/app/services/message.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: [],
})
export class OrdersComponent implements OnInit {
  @ViewChild('gForm') gForm: NgForm;
  @ViewChild('pForm') pForm: NgForm;

  now: string = moment().format('YYYY-MM-DD HH:mm');
  clients: Client[] = [];
  products: Product[] = [];
  product: Product = new Product(0, '', '', null, null, this.now, this.now);
  orders: Order[] = [];
  ordersDetail: OrderDetail[] = [];
  order: Order = new Order(0, null, this.now, this.now);
  orderDetail = new OrderDetail(0, null, null, 1, 0);
  tempDetails: any[] = [];

  productsToUpdate: Product[] = [];

  constructor(
    private clientService: ClientService,
    private productService: ProductService,
    private orderService: OrderService,
    private orderDetailService: OrderDetailService,
    private msgService: MessageService
  ) {}

  ngOnInit(): void {
    this.getClients();
    this.getProducts();
  }

  getClients() {
    this.clientService.getClients().subscribe((result: any) => {
      this.clients = result.data;
    });
  }

  getProducts() {
    this.productService.getProducts().subscribe((result: any) => {
      this.products = result.data;
      this.getOrders();
    });
  }

  getOrders() {
    this.orderService.getOrders().subscribe((result: any) => {
      this.orders = result.data;
    });
  }

  addDetail(od: OrderDetail) {
    //bconsole.log(this.products);
    this.product = this.products.find(
      (p) => p.IdProduct == Number(od.IdProduct)
    );

    
    if (this.orderDetail.Amount > this.product.Stock) {
      this.msgService.errorAlert("No se puede agregar el producto, el stock es insuficente");
      return;
    }

    this.productsToUpdate.push(this.product);
    // return;
    // console.log(product);
    const tempDetail = {
      Amount: od.Amount,
      IdProduct: this.product.IdProduct,
      Name: this.product.Name,
      Price: this.product.Price,
      Total: od.Amount * this.product.Price,
    };



    this.tempDetails.push(tempDetail);
    this.orderDetail = new OrderDetail(0, null, null, 1, 0);
    this.pForm.form.markAsPristine();
    this.pForm.form.markAsUntouched();
  }

  removeDetail(i: number) {
    this.tempDetails.splice(i, 1);
  }

  async createOrder() {
    // CREAR ORDEN
    const result = await this.orderService.createOrder(this.order).toPromise();

    // CREAR DETALLE DE LA ORDEN
    await this.createOrderDetail(Number(result.data.IdOrder));
    this.msgService.successToast('La orden se ha registrado correctamente.');

    // ACTUALIZAR  PRODUCTOS
    this.updateProduct();
    
    // RESET
    this.reset();

    /* this.orderService.createOrder(this.order).subscribe((result: any) => {
      const idOrder = Number(result.data.IdOrder);
      this.createOrderDetail(idOrder);
      this.msgService.successToast('La orden se ha registrado correctamente.');
    }); */
  }

  async editOrder(order: Order) {
    this.order = order;
    this.order.CreatedAt = moment(order.CreatedAt).format('YYYY-MM-DD HH:mm');

    // OBTENER EL DETALLE DE LA ORDEN QUE SE VA A EDITAR
    const result = await this.orderDetailService.getOrdersDetailByOrder(order.IdOrder).toPromise();
    this.ordersDetail = result.data;

    // CREAR UNA LISTA TEMPORAL
    this.tempDetails = [];
    this.ordersDetail.forEach((e) => {
      const product = this.products.find((p) => p.IdProduct == Number(e.IdProduct));
      const tempDetail = {
        Amount: e.Amount,
        IdProduct: product.IdProduct,
        Name: product.Name,
        Price: product.Price,
        Total: e.Total,
      };
      this.tempDetails.push(tempDetail);
    });

    /*this.orderDetailService
      .getOrdersDetailByOrder(order.IdOrder)
      .subscribe((result: any) => {
        this.ordersDetail = result.data;
        this.tempDetails = [];
        this.ordersDetail.forEach((e) => {
          const product = this.products.find(
            (p) => p.IdProduct == Number(e.IdProduct)
          );
          const tempDetail = {
            Amount: e.Amount,
            IdProduct: product.IdProduct,
            Name: product.Name,
            Price: product.Price,
            Total: e.Total,
          };
          this.tempDetails.push(tempDetail);
        });
      });*/
  }

  async updateOrder() {

    // ELIMINAR EL DETALLE DE LA ORDEN
    if (this.ordersDetail.length > 0) {
      await this.orderDetailService.deleteOrderDetailByOrder(this.order.IdOrder).toPromise();
    }

    // CREAR EL NUEVO DETALLE
    this.createOrderDetail(this.order.IdOrder);

    // ACTUALIZAR  PRODUCTOS
    this.updateProduct();

    // ACTUALIZAR ORDEN
    await this.orderService.updateOrder(this.order).toPromise(); 

    // RESET
    this.reset();


    /*this.order.ModifiedAt = this.now;
    this.orderService.updateOrder(this.order).subscribe((result: any) => {
      // console.log(result);
      if (this.ordersDetail.length > 0) {
        this.ordersDetail.forEach((e) => {
          this.orderDetailService
            .deleteOrderDetail(e.IdOrderDetail)
            .subscribe((result1: any) => {
              console.log(result1);
            });
        });
        this.createOrderDetail(this.order.IdOrder);
      } else {
        this.createOrderDetail(this.order.IdOrder);
      }
      this.msgService.successToast('La orden se ha actualizado correctamente.');
      this.getOrders();
    });*/
  }

  async deleteOrder() {
    const result = await this.msgService.confirmDeleteAlert("Está por eliminar la Orden. Desea continuar?");
    if(result.value) {
      // ELIMINAR EL DETALLE DE LA ORDEN
      if (this.ordersDetail.length > 0) {
        await this.orderDetailService.deleteOrderDetailByOrder(this.order.IdOrder).toPromise();
      }

      // ELIMINAR LA ORDEN
      await this.orderService.deleteOrder(this.order.IdOrder).toPromise();

      //RESET
      this.reset();
    }
  }

  async createOrderDetail(idOrder: number) {
    this.tempDetails.forEach(async (t) => {
      const orderDetail = new OrderDetail(0, idOrder, t.IdProduct, t.Amount, t.Total);
      await this.orderDetailService.createOrderDetail(orderDetail).toPromise();
    });
  }

  async updateProduct() {
    this.productsToUpdate.forEach(async (product) => {
      product.Stock = product.Stock - this.orderDetail.Amount;
      // console.log(product);
      await this.productService.updateProduct(product).toPromise();
    });
  }

  reset() {
    this.getOrders();
    this.productsToUpdate = [];
    this.tempDetails = [];
    this.order = new Order(0, null, this.now, this.now);
    this.orderDetail = new OrderDetail(0, null, null, 1, 0);
    this.gForm.form.markAsPristine();
    this.gForm.form.markAsUntouched();
    this.pForm.form.markAsPristine();
    this.pForm.form.markAsUntouched();
  }
}
