import { AllOrdersComponent } from './admin/all-orders/all-orders.component';
import { AuthGuard } from './_guards/auth.guard';
import { PreventChangesGuard } from './_guards/prevent-changes.guard';
import { MovieService } from './_services/movie.service';
import { GenreService } from './_services/genre.service';
import { AdminMoviesComponent } from './admin/admin-movies/admin-movies.component';
import { AdminNewComponent } from './admin/admin-new/admin-new.component';
import { AdminGuard } from './_guards/admin.guard';
import { AdminEditComponent } from './admin/admin-edit/admin-edit.component';
import { AlertifyService } from './_services/alertify.service';
import { AuthService } from './_services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ModalModule } from 'ngx-bootstrap/modal';








import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MovieComponent } from './movie/movie.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { OrderService } from './_services/order.service';
import { SpecificOrderComponent } from './specific-order/specific-order.component';
import { GenreComponent } from './genre/genre.component';
import { AllMoviesComponent } from './all-movies/all-movies.component';


@NgModule({
   declarations: [
      AppComponent,
      RegistrationComponent,
      HomeComponent,
      LoginComponent,
      AdminEditComponent,
      AdminNewComponent,
      AdminMoviesComponent,
      AllOrdersComponent,
      MovieComponent,
      CartComponent,
      OrderComponent,
      SpecificOrderComponent,
      GenreComponent,
      AllMoviesComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      MatFormFieldModule,
      MatCardModule,
      MatInputModule,
      MatCheckboxModule,
      MatButtonModule,
      MatDividerModule,
      BsDatepickerModule.forRoot(),
      PaginationModule.forRoot(),
      CarouselModule.forRoot(),
      RatingModule.forRoot(),
      ModalModule.forRoot(),
      BsDropdownModule.forRoot()
   ],
   providers: [
      AuthService,
      AlertifyService,
      AdminGuard,
      GenreService,
      MovieService,
      OrderService,
      PreventChangesGuard,
      AuthGuard
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
