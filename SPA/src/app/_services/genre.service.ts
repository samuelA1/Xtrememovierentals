import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertifyService } from './alertify.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  apiUrl: any = environment.apiUrl;


  constructor(private http: HttpClient, private alertify: AlertifyService) { }

  get headers() {
  const token = localStorage.getItem('token');
  return token ? new HttpHeaders().set('Authorization', token) : null;
  }

  getGenres() {
    return this.http.get(this.apiUrl + 'genre', {headers: this.headers}).toPromise();
  }

  addGenres(genre: any) {
    return this.http.post(this.apiUrl + 'genre', genre, {headers: this.headers}).toPromise();
  }

  deleteGenres(genreId: any) {
    return this.http.delete(this.apiUrl + 'genre/' + genreId, {headers: this.headers}).toPromise()
  }

}
