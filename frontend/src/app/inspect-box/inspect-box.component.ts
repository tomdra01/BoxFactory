import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-inspect-box',
  template: `
    <ion-card>
      <ion-toolbar>
        <ion-card-header>Inspecting Box</ion-card-header>
        <ion-card-subtitle>Box Price: {{ box?.price }}</ion-card-subtitle>
        <ion-card-subtitle>Box Size: {{ box?.size }}</ion-card-subtitle>
      </ion-toolbar>
      <img class="box-image" *ngIf="box?.size" [src]="getImagePath()" alt="Box Image">
    </ion-card>
  `,
  styleUrls: ['inspect-box.component.scss']
})
export class InspectBoxComponent implements OnInit {
  box: any;

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
    const size = this.box.size.toString(); // Convert to string if it's not
    const mappings: { [key: string]: string } = { // Explicitly define type
      'XXL': 'boxImgBig.png',
      'XL': 'boxImgBig.png',
      'L': 'boxImgLarge.jpg',
      'M': 'boxImgMedium.jpg',
      'S': 'boxImgSmall.jpg'
    };
    return `/assets/images/${mappings[size] || ''}`;
  }
}
