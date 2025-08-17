import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



import { AdminModule } from './admin/admin.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AuthModule } from './auth/auth.module';
import { PaginatorModule } from 'primeng/paginator';
import { NgChartsModule } from 'ng2-charts';
import { UserModule } from './user/user.module';
@NgModule({
  declarations: [
    AppComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    AuthModule,
    HttpClientModule,
    SlickCarouselModule,
    PaginatorModule,
    AuthModule,
    UserModule,
    NgChartsModule   // 👈 để đây là được
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
