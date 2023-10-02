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
      <ion-toolbar>
        <div class="toolbar-content">
          <div class="left-buttons">
            <ion-button class="home-button" routerLink="/">Home</ion-button>
            <ion-button class="add-button">ADD</ion-button>
          </div>
          <ion-searchbar class="search-bar" placeholder="Search" (ionInput)="searchBox($event)"></ion-searchbar>          <ion-buttons slot="end">
          </ion-buttons>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="custom-background">
      <div class="custom-background">
        <ion-grid>
          <ion-card class="narrow-card" *ngFor="let box of searchedBoxes">
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
export class HomePage implements OnInit{
  public searchResult: Box | null = null;
  public searchedBoxes: Box[] = [];
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

  async deleteBox(boxId?: number) {
    if (boxId === undefined) {
      console.error('Cannot delete box with undefined ID');
      return;
    }

    try {
      await firstValueFrom(this.http.delete(`${environment.baseUrl}/api/box/${boxId}`));
      console.log(`Deleted box with ID: ${boxId}`);

      // Optional: Refresh the state or remove the box from the local array
      this.state.boxes = this.state.boxes.filter(box => box.boxId !== boxId);
    } catch (error) {
      console.error(`Error deleting box with ID ${boxId}:`, error);
    }
  }

  async searchBox(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.value) {
      const boxId = Number(target.value);
      if (!Number.isNaN(boxId)) {
        try {
          const result = await firstValueFrom(this.http.get<Box>(`${environment.baseUrl}/api/box/${boxId}`));
          this.searchedBoxes = [result];
        } catch (error) {
          console.info(`Error fetching box with ID ${boxId}:`, error);
          this.searchedBoxes = [];
        }
      }
    } else {
      this.searchedBoxes = [...this.state.boxes];
    }
  }

  ngOnInit(): void {
    this.fetchBoxes().then(() => {
      this.searchedBoxes = [...this.state.boxes];
    });
  }
}
