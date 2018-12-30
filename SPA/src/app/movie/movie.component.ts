import { AuthService } from './../_services/auth.service';
import { MovieService } from './../_services/movie.service';
import { AlertifyService } from './../_services/alertify.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {
  movie: any;
  rating: any;
  constructor(private alertify: AlertifyService, private movieService: MovieService, private authService: AuthService) { }

  async ngOnInit() {
    this.getMovie();
  }

  async getMovie() {
    const movieId = localStorage.getItem('movieToSee');
    try {
      const movieToSee = await this.movieService.singleMovie(movieId);
      if (movieToSee['success']) {
        this.movie = movieToSee['movie'];
        this.rating = this.movie.averageRating
        console.log(this.movie)
      }
    } catch (error) {
      this.alertify.error('Unable to retrieve movie');
    }
  }

  addToCart(action: any, movieId: any) {
    var cartFrom: any = localStorage.getItem('cart')
    var cart: any = []
    if (cartFrom) {
      cart =JSON.parse(localStorage.getItem('cart'))
      const isPresent = cart.some(elt => {return movieId === elt.movieId})
      if (isPresent) {
        this.alertify.error('Movie has already been added to cart')
      } else {
        cart.push({action: action, movieId: movieId})
        localStorage.setItem('cart', JSON.stringify(cart));
        this.authService.cartNumber += 1;
      }
    } else {
      let cart: any =[]
      cart.push({action: action, movieId: movieId});
      localStorage.setItem('cart', JSON.stringify(cart));
      this.authService.cartNumber += 1;
    }
  }

}
