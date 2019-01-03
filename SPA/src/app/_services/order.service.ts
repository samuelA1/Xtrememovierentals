import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  apiUrl: any = environment.apiUrl;

  constructor(private http: HttpClient) { }

  get headers() {
  const token = localStorage.getItem('token');
  return token ? new HttpHeaders().set('authorization', token) : null;
  }

  purchase(order: any) {
    return this.http.post(this.apiUrl + 'payment', order, {headers: this.headers}).toPromise();
  }

  orders() {
    return this.http.get(this.apiUrl + 'orders', {headers: this.headers}).toPromise();
  }
 
  adminOrders() {
    return this.http.get(this.apiUrl + 'allOrders', {headers: this.headers}).toPromise();
  }

  specificOrder(orderId: any) {
    return this.http.get(this.apiUrl + 'orders/' + orderId, {headers: this.headers}).toPromise();
  }

}
