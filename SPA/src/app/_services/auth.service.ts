import { AlertifyService } from './alertify.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';



@Injectable()
export class AuthService {
apiUrl: any = environment.apiUrl;
user: any;
helper = new JwtHelperService();
cartNumber: any = 0;



constructor(private http: HttpClient, private alertify: AlertifyService) { }

get headers() {
const token = localStorage.getItem('token');
return token ? new HttpHeaders().set('Authorization', token) : null;
}

get loggedIn() {
    const token = localStorage.getItem('token');
    return this.helper.isTokenExpired(token);
}

async register(user: any) {
    return this.http.post(this.apiUrl + 'auth/register', user, {headers: this.headers}).toPromise()
    .then((res) => {
        this.user = this.helper.decodeToken(res['token'])
        return res;
    }).catch((error) => {
        this.alertify.error(error.message);
    })
}

async login(user: any) {
    return this.http.post(this.apiUrl + 'auth/login', user, {headers: this.headers}).toPromise()
    .then((res) => {
        this.user = this.helper.decodeToken(res['token'])
        return res;
    }).catch((error) => {
        this.alertify.error(error.message);
    })
}



}
