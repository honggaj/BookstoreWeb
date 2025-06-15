import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { StoreComponent } from './pages/store/store.component';
import { ProductCarouselComponent } from './components/product-carousel/product-carousel.component';
import { ProductListComponent } from './components/product-list/product-list.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    UserLayoutComponent,
    HeaderComponent,
    StoreComponent,
    ProductCarouselComponent,
    ProductListComponent,
    
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SlickCarouselModule,
      CarouselModule,
    ButtonModule,
    TagModule
   
  
  ]
})
export class UserModule { }
