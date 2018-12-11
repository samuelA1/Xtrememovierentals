import { GenreService } from './../../_services/genre.service';
import { AlertifyService } from './../../_services/alertify.service';
import { MovieService } from './../../_services/movie.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss']
})
export class AdminEditComponent implements OnInit {

movie: any = {};
genres: any[];
  constructor(private movieService: MovieService,
     private alertify: AlertifyService, private genreService: GenreService) { }

  ngOnInit() {
    this.getMovie();
    this.getGenres();
  }

  async getMovie() {
    var movieId = localStorage.getItem('movieId');
    try {
      const movie = await this.movieService.singleMovie(movieId);
      if (movie['success']) {
        let singleMovie = movie['movie'];
        let abstract = Object.assign({}, {
          title: singleMovie.title,
          description: singleMovie.description,
          director1: singleMovie.crew.directors[0],
          director2: singleMovie.crew.directors[1],
          actor1: singleMovie.crew.actors[0],
          actor2: singleMovie.crew.actors[1],
          actor3: singleMovie.crew.actors[2],
          actor4: singleMovie.crew.actors[3],
          actor5: singleMovie.crew.actors[4],
          genres: singleMovie.genre,
          image: singleMovie.image,
          contentRating: singleMovie.contentRating,
          price: singleMovie.price,
          movieLength: singleMovie.movieLength,
          numberInStockAsHd: singleMovie.numberInStockAsHd,
          numberInStockAsBluRay: singleMovie.numberInStockAsBluRay,
          releaseDate: singleMovie.releaseDate
        })

        this.movie = abstract
      }
    } catch (error) {
      this.alertify.error('Could not find movie');
    }
  }

  async getGenres() {
    try {
      const genre = await this.genreService.getGenres();
      this.genres = genre['genres'];
    } catch (error) {
      this.alertify.error(error.message);
    }
  }

}
