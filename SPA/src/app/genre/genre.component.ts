import { AlertifyService } from './../_services/alertify.service';
import { GenreService } from './../_services/genre.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {
movies: any;
  constructor(private genreService: GenreService, private alertify: AlertifyService) { }

  async ngOnInit() {
    await this.getMovie();
  }

  async getMovie() {
    try {
      const movies = await this.genreService.genreMovie(localStorage.getItem('genreId'));
      if (movies['success']) {
        this.movies = movies['movies'];
      }
    } catch (error) {
      this.alertify.error('Sorry, we are unable to retrieve movies at the moment')
    }
  }

  setId(movieId) {
    localStorage.setItem('movieToSee', movieId);
  }

}
