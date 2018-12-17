import { MovieService } from './../../_services/movie.service';
import { AlertifyService } from './../../_services/alertify.service';
import { GenreService } from '../../_services/genre.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-admin-new',
  templateUrl: './admin-new.component.html',
  styleUrls: ['./admin-new.component.scss']
})
export class AdminNewComponent implements OnInit {
  @ViewChild('f') f: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.f.dirty) {
      $event.returnValue = true;
    }
  }
  movie: any = {
    product_picture: null,
  };
  genres: any[];
  genre: any = {};
  colorTheme = 'theme-dark-blue';
  bsConfig: Partial<BsDatepickerConfig>;
 
  constructor(private genreService: GenreService,
     private alertify: AlertifyService, private movieService: MovieService, private router: Router) { }

  async ngOnInit() {
    await this.getGenres();
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    setTimeout(() => {
    });
  }

  fileChange(event: any) {
    this.movie.product_picture = event.target.files[0]
  }

  async getGenres() {
    try {
      const genre = await this.genreService.getGenres();
      this.genres = genre['genres'];
    } catch (error) {
      this.alertify.error(error.message);
    }
  }

  async deleteGenres(id: any) {
    try {
           this.alertify.confirm('Are you sure you want to delete this genre', async () => {
          const genre = await this.genreService.deleteGenres(id);
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
        var genre = await this.genreService.addGenres(this.genre);
        if (genre['success']) {
          this.genres.push(genre['genre']);
          this.genre.name = '';
          this.alertify.success(genre['message']);
        } else {
          this.alertify.error(genre['message'])
        }
      }
    } catch (error) {
      this.alertify.error(error.message);
    }
  }

  async addMovie() {
   this.extractions();
   if (this.validation(this.movie)) {
     const form = new FormData();
     for(const key in this.movie) {
      if (this.movie.hasOwnProperty(key)) {
        if(key == 'product_picture') {
          form.append(
            'product_picture',
            this.movie.product_picture,
            this.movie.product_picture.name
          );
          
        } else {
          form.append(key, this.movie[key])
        }
      }
    }
     const movie = await this.movieService.addMovie(form);
     if (movie['success']) {
       this.alertify.success(movie['message']);
       this.router.navigate(['/admin/admin-movies'])
     } else {
       this.alertify.error('The movie could not be added')
     }
   }
  }

  validation(movie: any) {
    if (movie.title) {
      if (movie.description) {
        if (movie.director1) {
          if (movie.actor1) {
            if (movie['0']) {
              if (movie.product_picture) {
                  if (movie.price) {
                    if (movie.numberInStockAsHd) {
                      if (movie.numberInStockAsBluRay) {
                        if (movie.contentRating) {
                          if (movie.Date) {
                            return true
                          } else {
                            this.alertify.error('Please enter a relaease date for movie')
                          }
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
