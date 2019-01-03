import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-specific-order',
  templateUrl: './specific-order.component.html',
  styleUrls: ['./specific-order.component.scss']
})
export class SpecificOrderComponent implements OnInit {
  order: any;
  orderId: any;
  constructor(private orderService: OrderService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  async ngOnInit() {
    await this.specificOrder();
  }

  async specificOrder() {
    try {
      this.route.params.subscribe(res => {
        this.orderId = res['id'];
      })
      const order = await this.orderService.specificOrder(this.orderId);
      if (order['success']) {
        this.order = order['order'];
      }
    } catch (error) {
      this.alertify.error('Sorry, we are unable to retrieve your order');
    }
  }

}
