import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';



@Injectable()
export class AuthService {
apiUrl: any = environment.apiUrl;
user: any;
helper = new JwtHelperService();


constructor(private http: HttpClient) { }

get headers() {
const token = localStorage.getItem('token');
return token ? new HttpHeaders().set('Authorization', token) : null;
}

async register(user: any) {
    return this.http.post(this.apiUrl + 'register', user, {headers: this.headers}).toPromise()
    .then((res) => {
        this.user = this.helper.decodeToken(res['token'])
        return res;
    }).catch((error) => {
        console.log(error.message);
    })
}

async login(user: any) {
    return this.http.post(this.apiUrl + 'register', user, {headers: this.headers}).toPromise()
    .then((res) => {
        this.user = this.helper.decodeToken(res['token'])
        return res;
    }).catch((error) => {
        console.log(error.message);
    })
}



}
