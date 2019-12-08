import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {RouterModule, Routes} from '@angular/router';
import {HeaderComponent} from './partials/header/header.component';
import {PagePreviewComponent} from './partials/page-preview/page-preview.component';
import {FooterComponent} from './partials/footer/footer.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FractalPageComponent} from './pages/fractal-page/fractal-page.component';
import {MatButtonModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSliderModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import { ColorModelsPageComponent } from './pages/color-models-page/color-models-page.component';
import { AffinePageComponent } from './pages/affine-page/affine-page.component';

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  },
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: 'fractal',
    component: FractalPageComponent
  },
  {
    path: 'color-models',
    component: ColorModelsPageComponent
  },
  {
    path: 'affine-transforms',
    component: AffinePageComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    PagePreviewComponent,
    FooterComponent,
    FractalPageComponent,
    ColorModelsPageComponent,
    AffinePageComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSliderModule,
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
