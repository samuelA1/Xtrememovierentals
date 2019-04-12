import { MovieService } from './_services/movie.service';
import { AlertifyService } from './_services/alertify.service';
import { GenreService } from './_services/genre.service';
import { AuthService } from './_services/auth.service';
import { Component, TemplateRef } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  modalRef: BsModalRef;
  movie: any;
  show:boolean = false;
  signIn = false;
  helper = new JwtHelperService();
  genres: any;
  movies: any;
  page: number = 1;
  movieTitle: any = {};

  constructor(public authService: AuthService, 
    private router: Router, 
    private genreService: GenreService,
    private movieService: MovieService,
    private alertify: AlertifyService,
    private modalService: BsModalService) {
    this.persist();
    this.getGenres();
    if (localStorage.getItem('cart')) {
      authService.cartNumber = JSON.parse(localStorage.getItem('cart')).length;
    }
  }

  persist () {
    const token = localStorage.getItem('token');
    this.authService.user = this.helper.decodeToken(token);
  }

  toggleCollapse() {
    this.show = !this.show
  }

  toggleSignIn() {
    this.signIn = !this.signIn;
  }

  logOut() {
    this.authService.user.user = {};
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }

  setGenreId(genreId: any) {
    localStorage.setItem('genreId', genreId);
    setTimeout(() => {
      window.location.reload();
  }, 20);
    
  }

  async getGenres() {
    try {
      const genre = await this.genreService.getGenres();
      this.genres = genre['genres'];
    } catch (error) {
      this.alertify.error(error.message);
    }
  }

  async searchMovies() {
    try {
      const data = await this.movieService.searchMovies(this.page, this.movieTitle.title);
      data['success'] ? (this.movies = data['content'].hits)
      : this.alertify.error('Could not find search');
    } catch (error) {
      this.alertify.error('Unable to search for movie');
      
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  setId(movieId: any) {
    localStorage.setItem('movieToSee', movieId);
    this.modalRef.hide();
    setTimeout(() => {
      window.location.reload();
  }, 20);
  }



}
