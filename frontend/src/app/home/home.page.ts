import {Component, OnInit} from '@angular/core';
import { State } from 'src/state';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Box} from "../../models";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  template: `
    <ion-content class="custom-background">
      <div class="custom-background">
      <ion-grid>
        <ion-card *ngFor="let box of state.boxes">
          <ion-toolbar>
            <ion-card-title>Box price: {{box.price}}</ion-card-title>
            <ion-card-subtitle>Box size: {{box.size}}</ion-card-subtitle>
          </ion-toolbar>
        </ion-card>
      </ion-grid>
      </div>
    </ion-content>
  `,
  styleUrls: ['home.component.scss'],
})
export class HomePage implements OnInit{
  constructor(public http: HttpClient, public state: State) {}

  async fetchBoxes() {
    try {
      const result = await firstValueFrom(this.http.get<Box[]>(`${environment.baseUrl}/api/boxes`));
      console.log('Fetched Boxes:', result);
      this.state.boxes = result;
      console.log('State Boxes:', this.state.boxes);
    } catch (error) {
      console.error('Error fetching boxes:', error);
    }
  }

  ngOnInit(): void {
    this.fetchBoxes();
  }
}
