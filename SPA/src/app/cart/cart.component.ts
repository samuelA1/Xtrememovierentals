import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { MovieService } from './../_services/movie.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../_services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
movies: any = [];
address: any = {};
card: any = {};
totalPrice: any = 0;
modalRef: BsModalRef;
  constructor(private movieService: MovieService,
     private orderService: OrderService,
     private modalService: BsModalService,
     private authService: AuthService,
     private alertify: AlertifyService,
     private router: Router) { }

  ngOnInit() {
    this.getMovies();
    this.address = this.authService.user['user'].address;
  }

  getMovies() {
    this.movies = JSON.parse(localStorage.getItem('cart')) || [];
    this.movies.forEach(movie => {
      this.totalPrice += movie.moviePrice;
    });
  }

  openModal(template: TemplateRef<any>) {
    if (this.authService.loggedIn) {
      this.router.navigate(['/login', {returnUrl: '/cart'}])
      this.alertify.message('You must be logged in to purchase movie');
    } else {
      this.modalRef = this.modalService.show(template);
    }
  }

  removeFromCart(movieId: any, price: any) {
    this.alertify.confirm('Are you sure you want to remove this product from your cart?', ()=> {
      this.movies.splice(this.movies.findIndex(movie => movie['movieId'] === movieId), 1);
      localStorage.setItem('cart', JSON.stringify(this.movies));
      this.authService.cartNumber -= 1;
      this.totalPrice -= price;
    })
  }

  async purchase() {
    let order = {};
    try {
      if (this.validateAddress(this.address) && this.validateCard(this.card)) {
        const addAddress = await this.authService.addAddress(this.address);
        if (addAddress['success']) {
          order['totalPrice'] = this.totalPrice;
          order['movies'] = this.movies;
          const orders = await this.orderService.purchase(order);
          if (orders['success']) {
            this.alertify.success('Purchase successful');
            this.movies = [];
            this.authService.cartNumber = 0;
            localStorage.removeItem('cart');
            this.modalRef.hide();
          }
        }
      }
    } catch (error) {
      this.alertify.error('Unable to make purchase');
    }
  }

  validateAddress(address: any) {
    if (address.addr1) {
      if (address.country) {
        if (address.state) {
          if (address.city) {
            if (address.zip) {
              return true;
            } else {
              this.alertify.error('Please fill in your zip code');
            }
          } else {
            this.alertify.error('Please fill in your city');
          }
        } else {
          this.alertify.error('Please fill in your state');
        }
      } else {
        this.alertify.error('Please fill in your country');
      }
    } else {
      this.alertify.error('Please fill in your home address');
    }
  }

  validateCard(card: any) {
    if (card.first) {
      if (card.last) {
        if (card.number) {
          if (card.date) {
            if (card.cvc) {
              if (card.number.length === 16) {
                if (card.cvc.length === 3) {
                  return true;
                } else {
                  this.alertify.error('Your security code must be 3 characters');
                }
              } else {
                this.alertify.error('Your card number must be 16 characters');
              }
            } else {
              this.alertify.error('Please fill in your security code at the back of your card');
            }
          } else {
            this.alertify.error('Please fill in your card expiration date');
          }
        } else {
          this.alertify.error('Please fill in your card number');
        }
      } else {
        this.alertify.error('Please fill in your last name');
      }
    } else {
      this.alertify.error('Please fill in your first name');
    }
  }
}
