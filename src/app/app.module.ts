import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Background3dComponent } from './background3d/background3d.component';
import { Citybackground3dComponent } from './citybackground3d/citybackground3d.component';

@NgModule({
  declarations: [
    AppComponent,
    Background3dComponent,
    Citybackground3dComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
