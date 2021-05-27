import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

import * as moment from 'moment';
import { Product } from 'src/app/models/product';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styles: [
  ]
})
export class ProductsComponent implements OnInit {
  @ViewChild('gForm') gForm: NgForm;

  constructor(private productService: ProductService) {}

  now: string = moment().format('YYYY-MM-DD HH:mm');
  products: Product[] = [];
  product: Product = new Product(0,'','', null, null, this.now, this.now);

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe((result: any) => {
      this.products = result.data;
    });
  }

  async createProduct() {
    await this.productService.createProduct(this.product).toPromise();
    this.reset();
  }

  reset() {
    this.product = new Product(0,'','', null, null, this.now, this.now);
    this.gForm.form.markAsPristine();
    this.gForm.form.markAsUntouched();
    this.getProducts();
  }

}
