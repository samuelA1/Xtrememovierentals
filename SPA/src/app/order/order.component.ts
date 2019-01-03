import { AuthService } from './../_services/auth.service';
import { AlertifyService } from './../_services/alertify.service';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
orders: any;
  constructor(private orderService: OrderService,
     private alertify: AlertifyService,
     public authService: AuthService) { }

  async ngOnInit() {
    await this.getOrders();
  }

  async getOrders() {
    try {
      const orders = await this.orderService.orders();
      if (orders['success']) {
        this.orders = orders['orders'];
      }
    } catch (error) {
      this.alertify.error('Sorry, we are unable to retrieve your orders');
    }
  }

}
