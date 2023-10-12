import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {State} from "../../state";
import {firstValueFrom} from "rxjs";
import {Box} from "../../models";
import {environment} from "../../environments/environment";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-box',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Add Box
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="background">
      <ion-item>
        <ion-label>Box Size:</ion-label>
        <ion-select [(ngModel)]="selectedSize">
          <ion-select-option *ngFor="let size of boxSizes" [value]="size">{{ size }}</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-label position="floating">Price:</ion-label>
        <ion-input type="number" [(ngModel)]="price"></ion-input>
      </ion-item>

      <ion-button expand="full" color="dark" (click)="addBox()">Add</ion-button>
    </ion-content>
  `,
  styleUrls: ['./add-box.component.scss'],
})

export class AddBoxComponent {
  boxSizes: string[] = ['S', 'M', 'L', 'XL'];
  selectedSize: string = 'M';
  price: number | null = null;

  constructor(private http: HttpClient, private router: Router, public state: State, private toastController: ToastController) {}

  async addBox(): Promise<void> {
    if (this.validateData()) {
      const boxData = {
        size: this.selectedSize,
        price: this.price || 0,
      };

      try {
        const newBox = await firstValueFrom(this.http.post<Box>(
          `${environment.baseUrl}/api/box`,
          boxData
        ));

        this.state.boxes.push(newBox);

        this.selectedSize = 'M';
        this.price = null;

        const toast = await this.toastController.create({
          message: 'Box added successfully',
          duration: 2000,
        });

        toast.present;
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error adding box:', error);
      }
    }
  }

  private validateData(): boolean {
    if (!this.boxSizes.includes(this.selectedSize)) {
      console.error('Invalid box size selected');
      return false;
    }

    if (typeof this.price !== 'number' || isNaN(this.price) || this.price < 0) {
      console.error('Invalid price value');
      return false;
    }

    if (this.selectedSize === null || this.selectedSize === undefined) {
      console.error('Selected size is null or undefined');
      return false;
    }

    if (this.price === null || this.price === undefined) {
      console.error('Price is null or undefined');
      return false;
    }
    return true;
  }
}

