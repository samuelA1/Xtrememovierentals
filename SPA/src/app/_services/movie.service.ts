import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  apiUrl: any = environment.apiUrl;


  constructor(private http: HttpClient) { }

  get headers() {
  const token = localStorage.getItem('token');
  return token ? new HttpHeaders().set('authorization', token) : null;
  }

  addMovie(movie: any) {
    return this.http.post(this.apiUrl + 'admin/movies', movie, {headers: this.headers}).toPromise();
  }

  getMovies(page) {
    return this.http.get(this.apiUrl + `admin/movies?page=${page-1}`, {headers: this.headers}).toPromise();
  }

  searchMovies(page: any, word: string) {
    return this.http.get(this.apiUrl + `search?query=${word}&page=${page-1}`, {headers: this.headers}).toPromise();
  }

  singleMovie(movieId: any) {
    return this.http.get(this.apiUrl + 'movie/' + movieId, {headers: this.headers}).toPromise();
  }

  updateMovie(movieImage, movieId: any) {
    return this.http.post(this.apiUrl + 'admin/update/' + movieId, movieImage, {headers: this.headers}).toPromise();
  }

  deleteMovie(movieId: any) {
    return this.http.delete(this.apiUrl + 'admin/movie/' + movieId, {headers: this.headers}).toPromise();
  }
 
}
