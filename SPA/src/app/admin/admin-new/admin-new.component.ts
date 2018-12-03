import { AlertifyService } from './../../_services/alertify.service';
import { MovieService } from './../../_services/movie.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-new',
  templateUrl: './admin-new.component.html',
  styleUrls: ['./admin-new.component.scss']
})
export class AdminNewComponent implements OnInit {
  movie: any = {
    product_picture: null,
    movie_picture: null
  };
  genres: any[];
  genre: any = {};
  completeMovie: any = {
    genreId: [],
    director: [],
    actor: [],
  };

  constructor(private movieService: MovieService, private alertify: AlertifyService) { }

  async ngOnInit() {
    await this.getGenres();
  }

  fileChange(event: any) {
    this.movie.product_picture = event.target.files[0]
  }

  coverImage(event: any) {
    this.movie.movie_picture = event.target.files[0];
  }

  async getGenres() {
    try {
      const genre = await this.movieService.getGenres();
      this.genres = genre['genres'];
    } catch (error) {
      this.alertify.error(error.message);
    }
  }

  async deleteGenres(id: any) {
    try {
           this.alertify.confirm('Are you sure you want to delete this genre', async () => {
          const genre = await this.movieService.deleteGenres(id);
          if (genre['success']) {
          this.genres.splice(this.genres.findIndex(genre => genre._id == id), 1);
          this.alertify.success(genre['message'])
          }
        })
    } catch (error) {
      this.alertify.error(error.message);
    }
  }

  async addGenre() {
    try {
      if (this.genre.name) {
        var genre = await this.movieService.addGenres(this.genre);
        if (genre['success']) {
          this.genres.push(genre['genre']);
          this.genre.name = '';
          this.alertify.success(genre['message']);
        }
      }
    } catch (error) {
      this.alertify.error(error.message);
    }
  }

  addMovie() {
   this.extractions();
   if (this.validation(this.completeMovie)) {
   }
  }

  validation(movie: any) {
    if (movie.title) {
      if (movie.description) {
        if (movie.director) {
          if (movie.actor) {
            if (movie.genreId) {
              if (movie.product_picture) {
                if (movie.movie_picture) {
                  if (movie.price) {
                    if (movie.asHd) {
                      if (movie.asBluRay) {
                        if (movie.contentRating) {
                          return true
                        } else {
                          this.alertify.error('Please enter content rating')
                        }
                      } else {
                        this.alertify.error('Please enter amount of movies present available as BluRay')
                      }
                    } else {
                      this.alertify.error('Please enter amount of movies present available as HD')
                    }
                  } else {
                    this.alertify.error('Please price')
                  }
                } else {
                  this.alertify.error('Please upload cover image')
                }
              } else {
                this.alertify.error('Please upload movie image')
              }
            } else {
              this.alertify.error('Please select at least one genre')
            }
          } else {
            this.alertify.error('Please enter the name of at least one actor')
          }
        } else {
          this.alertify.error('Please enter the name of at least one director')
        }
      } else {
        this.alertify.error('Please enter a description')
      }
    } else {
      this.alertify.error('Please enter a title')
    }
  }

  extractions() {
    this.genres.filter(genre => {
      return genre.checked == true;
    }).map(filteredGenre => {
      this.completeMovie.genreId.push(filteredGenre._id)
    });

    if (this.movie.director1) {
      this.completeMovie.director.push(this.movie.director1);
      if (this.movie.director2) {
        this.completeMovie.director.push(this.movie.director2);
      }
    }
    if (this.movie.actor1) {
      this.completeMovie.actor.push(this.movie.actor1);
      if (this.movie.actor2) {
        this.completeMovie.actor.push(this.movie.actor2);
        if (this.movie.actor3) {
          this.completeMovie.actor.push(this.movie.actor3);
          if (this.movie.actor4) {
            this.completeMovie.actor.push(this.movie.actor4);
            if (this.movie.actor5) {
              this.completeMovie.actor.push(this.movie.actor5);
            }
          }
        }
      }
    }

    this.completeMovie = Object.assign(this.completeMovie, {
      title: this.movie.title,
      price: this.movie.price,
      contentRating: this.movie.contentRating,
      movie_picture: this.movie.movie_picture,
      product_picture: this.movie.product_picture,
      description: this.movie.description,
      asHd: this.movie.numberInStockAsHd,
      asBluRay: this.movie.numberInStockAsBluRay,
      movieLength: this.movie.movieLength
    })
  }
}
