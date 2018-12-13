import { GenreService } from './../../_services/genre.service';
import { AlertifyService } from './../../_services/alertify.service';
import { MovieService } from './../../_services/movie.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss']
})
export class AdminEditComponent implements OnInit {
product_picture: File = null;
movie: any = {};
genres: any[];
  constructor(private movieService: MovieService,
     private alertify: AlertifyService, private genreService: GenreService,  private router: Router) { }

  ngOnInit() {
    this.getMovie();
    this.getGenres();
  }

  fileChange(event: any) {
    this.product_picture = <File>event.target.files[0];
  }

  async uploadImage(movieId) {
      const fd = new FormData();
      fd.append('product_picture',this.product_picture,this.product_picture.name);
      const movie = await this.movieService.updateMovie(fd, movieId);
      if (movie['success']) {
        this.alertify.success('Image upload successful');
        this.router.navigate(['/admin/admin-movies'])
      } else {
        this.alertify.error('Image failed to upload')
      }
  }

  async editMovie(movieId: any) {
    this.extractions();
    const movie = await this.movieService.updateMovie(this.movie, movieId);
    if (movie['success']) {
      this.alertify.success(movie['message']);
      this.router.navigate(['/admin/admin-movies'])
    } else {
      this.alertify.error('This movie could not be updated')
    }
   }

  async getMovie() {
    var movieId = localStorage.getItem('movieId');
    try {
      const movie = await this.movieService.singleMovie(movieId);
      if (movie['success']) {
        let singleMovie = movie['movie'];
        let abstract = Object.assign({}, {
          _id: singleMovie._id,
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
          releaseDate: singleMovie.releaseDate,
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

  async deleteMovie(movieId: any) {
    try {
      const movieToDelete = await this.movieService.deleteMovie(movieId);
      if (movieToDelete['success']) {
        this.alertify.success(movieToDelete['message']);
        this.router.navigate(['/admin/admin-movies'])
      } else {
        this.alertify.error('This movie could not be deleted')
      }
    } catch (error) {
      this.alertify.error('Movie could not be deleted');
    }
  }

  extractions() {
    var filteringGenre = []
    this.genres.filter(genre => {
      return genre.checked == true;
    }).map(filteredGenre => {
      filteringGenre.push(filteredGenre._id)
    });

    var genreRearrange = Object.assign({}, filteringGenre);
    this.movie = Object.assign(this.movie, genreRearrange);
  }

}
