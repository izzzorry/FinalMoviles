import { Component, OnInit } from '@angular/core';
import { AppInitService } from 'src/app/guards/AuthGuard';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-init',
  template: `<ion-spinner></ion-spinner>`,
  imports: [IonicModule, CommonModule] 
})
export class AppInitPage implements OnInit {
  constructor(private appInitService: AppInitService) {}

  ngOnInit() {
    this.appInitService.initApp();
  }
}
