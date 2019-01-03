import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/_services/order.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss']
})
export class AllOrdersComponent implements OnInit {

  orders: any;
  constructor(private orderService: OrderService,
     private alertify: AlertifyService) { }

  async ngOnInit() {
    await this.allOrders();
  }

  async allOrders() {
    try {
      const orders = await this.orderService.adminOrders();
      if (orders['success']) {
        this.orders = orders['orders'];
        console.log(this.orders)
      }
    } catch (error) {
      this.alertify.error('Sorry, we are unable to retrieve your orders');
    }
  }
}
