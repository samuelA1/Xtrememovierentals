import { MovieService } from './../_services/movie.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor(private movieService: MovieService) { }

  ngOnInit() {
  }

}
