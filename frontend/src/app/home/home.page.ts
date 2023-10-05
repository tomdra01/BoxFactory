import {Component, OnInit} from '@angular/core';
import { State } from 'src/state';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Box} from "../../models";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar class="toolbar-content">
        <div class="toolbar-content">
          <div class="left-buttons">
            <ion-button class="home-button" routerLink="/">Home</ion-button>
            <ion-button class="add-button">ADD</ion-button>
          </div>
          <ion-buttons slot="end">
          </ion-buttons>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="cloud-element"></div>
      <div class="parent">
        <ion-grid class="grid">
          <ion-button class="center-button" (click)="scrollToTarget()">See boxes</ion-button>
        </ion-grid>
      </div>

      <div id="scrollTarget" class="page">
        <ion-grid>
          <!-- Changed here from searchedBoxes to state.boxes -->
          <ion-card class="narrow-card" *ngFor="let box of state.boxes">
            <ion-toolbar>
              <ion-card-header>Box Id: {{box.boxId}}</ion-card-header>
              <ion-card-subtitle>Box price: {{box.price}}</ion-card-subtitle>
              <ion-card-subtitle>Box size: {{box.size}}</ion-card-subtitle>
              <ion-buttons slot="end">
                <ion-button (click)="deleteBox(box.boxId)">
                  <ion-icon name="trash"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-card>
        </ion-grid>
      </div>
    </ion-content>
  `,
  styleUrls: ['home.component.scss'],
})

export class HomePage implements OnInit {
  constructor(private http: HttpClient, public state: State) {} // Made state public

  async ngOnInit(): Promise<void> {
    await this.fetchBoxes();
  }

  async fetchBoxes(): Promise<void> {
    try {
      const boxes = await firstValueFrom(this.http.get<Box[]>(`${environment.baseUrl}/api/boxes`));
      this.state.boxes = boxes;
    } catch (error) {
      console.error('Error fetching boxes:', error);
    }
  }

  scrollToTarget(): void {
    const targetElement = document.getElementById('scrollTarget');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async deleteBox(boxId?: number): Promise<void> {
    if (boxId === undefined) {
      console.error('Cannot delete box with undefined ID');
      return;
    }

    try {
      await firstValueFrom(this.http.delete(`${environment.baseUrl}/api/box/${boxId}`));
      this.state.boxes = this.state.boxes.filter(box => box.boxId !== boxId);
    } catch (error) {
      console.error(`Error deleting box with ID ${boxId}:`, error);
    }
  }
}
