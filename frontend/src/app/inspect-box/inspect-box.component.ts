import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-inspect-box',
  template: `
    <ion-content class="background">
      <ion-card>
        <ion-toolbar>
          <ion-card-header>
            <ion-input *ngIf="editing" [(ngModel)]="box.boxId"></ion-input>
            <span *ngIf="!editing">Box Id: {{ box?.boxId }}</span>
          </ion-card-header>
          <ion-card-subtitle>
            <ion-input *ngIf="editing" [(ngModel)]="box.price"></ion-input>
            <span *ngIf="!editing">Box Price: {{ box?.price }}</span>
          </ion-card-subtitle>
          <ion-card-subtitle>
            <ion-select *ngIf="editing" [(ngModel)]="box.size">
              <ion-select-option *ngFor="let size of boxSizes" [value]="size">{{ size }}</ion-select-option>
            </ion-select>
            <span *ngIf="!editing">Box Size: {{ box?.size }}</span>
          </ion-card-subtitle>
          <ion-buttons slot="end">
            <ion-button *ngIf="!editing" (click)="toggleEditing()">
              <ion-icon name="pencil-outline"></ion-icon>
            </ion-button>
            <ion-button *ngIf="editing" (click)="confirmChanges()">
              <ion-icon name="download-outline"></ion-icon>
            </ion-button>
            <ion-button *ngIf="editing" (click)="cancelChanges()">
              <ion-icon name="exit-outline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <img class="box-image" *ngIf="box?.size" [src]="getImagePath()" alt="Box Image">
      </ion-card>
    </ion-content>
  `,
  styleUrls: ['inspect-box.component.scss']
})
export class InspectBoxComponent implements OnInit {
  box: any;
  editing: boolean = false;
  boxSizes: string[] = ['S', 'M', 'L', 'XL'];

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const boxId = params['boxId'];
      this.fetchBoxDetails(boxId);
    });
  }

  fetchBoxDetails(boxId: string) {
    this.http.get(`${environment.baseUrl}/api/box/${boxId}`).subscribe({
      next: (data: any) => {
        this.box = data;
      },
      error: (error) => {
        console.error('An error occurred:', error);
      }
    });
  }

  getImagePath(): string {
    if (!this.box?.size) return '';
    const size = this.box.size.toString();
    const mappings: { [key: string]: string } = {
      'XL': 'boxImgBig.png',
      'L': 'boxImgLarge.jpg',
      'M': 'boxImgMedium.jpg',
      'S': 'boxImgSmall.jpg'
    };
    return `/assets/images/${mappings[size] || ''}`;
  }

  toggleEditing(): void {
    this.editing = !this.editing;
  }

  confirmChanges(): void {
    const boxId = this.box.boxId;
    this.http.put(`${environment.baseUrl}/api/box/${boxId}`, this.box).subscribe({
      next: (updatedBox: any) => {
        this.box = updatedBox;
        this.editing = false;
      },
      error: (error) => {
        console.error('An error occurred:', error);
      }
    });
  }

  cancelChanges(): void {
    this.editing = false;
  }
}
