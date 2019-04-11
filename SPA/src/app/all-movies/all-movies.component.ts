import { Component, OnInit } from '@angular/core';
import { MovieService } from '../_services/movie.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-all-movies',
  templateUrl: './all-movies.component.html',
  styleUrls: ['./all-movies.component.scss']
})
export class AllMoviesComponent implements OnInit {
  movies: any;
  totalItems: any;
  page: number = 1;

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
      this.alertify.error('Unable to retrieve movies');
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
      this.alertify.error('Unable to retrieve movies');
    }
  }

  setId(movieId) {
    localStorage.setItem('movieToSee', movieId);
  }

  pageChanged(event: any) {
    this.page = event.page;
    this.getMovies();
  }

}
