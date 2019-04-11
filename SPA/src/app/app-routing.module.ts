import { AllMoviesComponent } from './all-movies/all-movies.component';
import { AllOrdersComponent } from './admin/all-orders/all-orders.component';
import { AuthGuard } from './_guards/auth.guard';
import { CartComponent } from './cart/cart.component';
import { PreventChangesGuard } from './_guards/prevent-changes.guard';
import { MovieComponent } from './movie/movie.component';
import { AdminNewComponent } from './admin/admin-new/admin-new.component';
import { AdminMoviesComponent } from './admin/admin-movies/admin-movies.component';
import { AdminEditComponent } from './admin/admin-edit/admin-edit.component';
import { AdminGuard } from './_guards/admin.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OrderComponent } from './order/order.component';
import { SpecificOrderComponent } from './specific-order/specific-order.component';
import { GenreComponent } from './genre/genre.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'movies', component: AllMoviesComponent},
  {path: 'movies/:name', component:  MovieComponent},
  {path: 'genres/:name', component: GenreComponent},
  {path: 'cart', component: CartComponent},
  {path: 'orders', component: OrderComponent, canActivate: [AuthGuard]},
  {path: 'orders/:id', component: SpecificOrderComponent, canActivate: [AuthGuard]},
  {path: '',
    canActivate:[AdminGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {path: 'admin/admin-edit/:id', component: AdminEditComponent},
      {path: 'admin/admin-movies', component: AdminMoviesComponent},
      {path: 'admin/admin-new', component: AdminNewComponent, canDeactivate: [PreventChangesGuard]},
      {path: 'all-orders', component: AllOrdersComponent}
    ]},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
