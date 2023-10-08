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
    </ion-card>
  `
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
}
