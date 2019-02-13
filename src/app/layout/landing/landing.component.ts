import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, Route } from '@angular/router';
import { HeaderService } from 'src/app/header.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private spinnerService: Ng4LoadingSpinnerService,private headerService: HeaderService) {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(),600);
  }
  ngOnInit() {
    this.headerService.setTitle('landing');
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('home_background');
  }

  ngOnDestroy(): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('home_background');
  }
}
