import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {AddBoxComponent} from "./add-box/add-box.component";
import {FormsModule} from "@angular/forms";
import {InspectBoxComponent} from "./inspect-box/inspect-box.component";

@NgModule({
  declarations: [AppComponent, AddBoxComponent, InspectBoxComponent],  // Add it here
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
