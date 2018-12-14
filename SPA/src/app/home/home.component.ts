import { AlertifyService } from './../_services/alertify.service';
import { GenreService } from './../_services/genre.service';
import { MovieService } from './../_services/movie.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
genreMovies: any[] = [];

  constructor(private movieService: MovieService,
     private genreService: GenreService, private alertify: AlertifyService) { }

  async ngOnInit() {
    this.getAllGenreMovies();
  }

  async getAllGenreMovies() {
    try {
      var genres = [];
      const genre = await this.genreService.getGenres();
      genres = genre['genres']
      genres.forEach(async genreLoop => {
        const movies = await this.genreService.genreMovie(genreLoop._id)
        this.genreMovies.push(movies)
        // console.log(movies)
      });
      console.log(this.genreMovies)
    } catch (error) {
      this.alertify.error(error.message);
    }
  }


}
