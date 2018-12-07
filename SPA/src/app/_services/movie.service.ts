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

}
