import {Component, OnInit} from '@angular/core';
import {State} from 'src/state';
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
            <ion-button class="home-button" color="dark" routerLink="/">Home</ion-button>
            <ion-button class="add-button" color="dark" [routerLink]="['/add']">ADD</ion-button>
          </div>
          <ion-buttons slot="end">
          </ion-buttons>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen="true">
      <div class="parent">
        <ion-grid class="grid">
          <ion-button class="center-button" color="dark" (click)="scrollToTarget()">See boxes</ion-button>
        </ion-grid>
      </div>

      <div id="sizeCards" class="page">
        <ion-grid>
          <ion-row>
            <ion-col *ngFor="let size of ['S', 'M', 'L', 'XL']">
              <ion-card>
                <ion-card-content>
                  <ion-row>
                    <ion-col class="card-content-left" size="9">
                      <ion-card-header>
                        {{ size }} Size
                      </ion-card-header>
                      <ion-card-subtitle>Stock: {{ getStockCount(size) }}</ion-card-subtitle>
                      <ion-card-subtitle>Average Price: {{ getAveragePrice(size) }}</ion-card-subtitle>
                      <ion-card-subtitle>Lowest Price: {{ getLowestPrice(size) }}</ion-card-subtitle>
                    </ion-col>
                    <ion-col class="card-content-right" size="3">
                      <img class="box-image" *ngIf="size" [src]="getImagePath(size)" alt="Box Image">
                    </ion-col>
                  </ion-row>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <div class="filter-section">
        <ion-label *ngFor="let size of ['S', 'M', 'L', 'XL', 'XXL']">
          <ion-checkbox [(ngModel)]="sizeFilters[size]" (ionChange)="applyFilter()"></ion-checkbox>
          {{size}}
        </ion-label>
      </div>

      <div id="scrollTarget" class="page">
        <div class="grid-container">
          <div class="grid-item" *ngFor="let box of filteredBoxes">
            <ion-card>
              <ion-toolbar>
                <ion-card-header>Box Id: {{box.boxId}}</ion-card-header>
                <ion-card-subtitle>Box price: {{box.price}}</ion-card-subtitle>
                <ion-card-subtitle>Box size: {{box.size}}</ion-card-subtitle>
                <ion-buttons slot="end">
                  <ion-button (click)="deleteBox(box.boxId)">
                    <ion-icon name="trash"></ion-icon>
                  </ion-button>
                  <ion-button [routerLink]="['/inspect', box.boxId]" *ngIf="box.boxId !== undefined">
                    <ion-icon name="eye-outline"></ion-icon>
                  </ion-button>
                </ion-buttons>
              </ion-toolbar>
            </ion-card>
          </div>
        </div>
      </div>
    </ion-content>

  `,
  styleUrls: ['home.component.scss'],
})

export class HomePage implements OnInit {
  public sizeFilters: { [key: string]: boolean } = {
    'S': true,
    'M': true,
    'L': true,
    'XL': true,
    'XXL': true
  };

  public filteredBoxes: Box[] = [];

  currentImageIndex: number = 0;

  public applyFilter(): void {
    this.filteredBoxes = this.state.boxes.filter(box => box.size !== undefined && this.sizeFilters[box.size.toString() as keyof typeof this.sizeFilters]);
  }

  constructor(private http: HttpClient, public state: State) {}

  async ngOnInit(): Promise<void> {
    await this.fetchBoxes();
    this.applyFilter();

    setInterval(() => {
      this.currentImageIndex++;
    }, 15000);
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

  viewBox(boxId: string) {
    this.http.get(`${environment.baseUrl}/api/box/${boxId}`).subscribe({
      next: (data: any) => {
        // Process the received box data
        console.log('Received box data:', data);
      },
      error: (error) => {
        // Handle errors
        console.error('An error occurred:', error);
      },
      complete: () => {
        // Optional: Code to run once the Observable is complete
        console.log('Request completed.');
      },
    });
  }

  getStockCount(size: string): number {
    return this.state.boxes.filter(box => box.size?.toString() === size).length;
  }

  getAveragePrice(size: string): number | string {
    const boxesOfSize = this.state.boxes.filter(box => box.size !== undefined && box.size.toString() === size && box.price !== undefined);
    if (boxesOfSize.length === 0) return 'N/A';

    const sum = boxesOfSize.reduce((acc, box) => acc + (box.price || 0), 0);  // box.price || 0 ensures it falls back to 0 if undefined
    return (sum / boxesOfSize.length).toFixed(2);
  }

  getLowestPrice(size: string): number | string {
    const boxesOfSize = this.state.boxes.filter(box => box.size !== undefined && box.size.toString() === size && box.price !== undefined);
    if (boxesOfSize.length === 0) return 'N/A';

    const lowest = Math.min(...boxesOfSize.map(box => box.price || Infinity));  // box.price || Infinity ensures it falls back to Infinity if undefined
    return lowest.toFixed(2);
  }

  getImagePath(size: string): string {
    const sizeMappings: { [key: string]: string } = {
      'XL': 'box-XL-right.png',
      'L': 'box-L-right.png',
      'M': 'box-M-right.png',
      'S': 'box-S-right.png'
    };

    const leftImageMappings: { [key: string]: string } = {
      'XL': 'box-XL-left.png',
      'L': 'box-L-left.png',
      'M': 'box-M-left.png',
      'S': 'box-S-left.png'
    };

    const isRightImage = this.currentImageIndex % 2 === 0;
    const mappings = isRightImage ? sizeMappings : leftImageMappings;

    return `/assets/images/boxes/${mappings[size] || ''}`;
  }
}
