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

}
