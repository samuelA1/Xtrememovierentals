import { AlertifyService } from './../../_services/alertify.service';
import { MovieService } from './../../_services/movie.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-movies',
  templateUrl: './admin-movies.component.html',
  styleUrls: ['./admin-movies.component.scss']
})
export class AdminMoviesComponent implements OnInit {
  movies: any[];
  totalItems: any;
  page: any = 1;
  movie: any = {};
  hide: any = false;

  constructor(private movieService: MovieService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getAllMovies();
  }

  async getMovies() {
    try {
      const movies = await this.movieService.getMovies(this.page);
      if (movies['success']) {
        this.movies = movies['movies'];
        this.totalItems = movies['totalItems']
      }
    } catch (error) {
      this.alertify.error(error);
    }
  }

  async getAllMovies() {
    try {
      const movies = await this.movieService.getAllMovies(this.page);
      if (movies['success']) {
        this.movies = movies['movies'];
        this.totalItems = movies['totalItems']
      }
    } catch (error) {
      this.alertify.error(error);
    }
  }

  async searchMovies() {
    if (this.movie.title == '') {
      this.getMovies();
      this.hide = false;
    }
    try {
      const data = await this.movieService.searchMovies(this.page, this.movie.title);
      data['success'] ? (this.movies = data['content'].hits, this.hide = true)
      : this.alertify.error('Could not find search');
    } catch (error) {
      this.alertify.error(error);
      
    }
  }

  pageChanged(event: any) {
    this.page = event.page;
    this.getMovies();
  }

  editMovie(id: any) {
    localStorage.setItem('movieId', id);
  }

}
