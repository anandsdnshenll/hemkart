import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HeaderService } from 'src/app/header.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private activeRoute:ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,private headerService:HeaderService) {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(),800);
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('auth')
   }
   url:string;
  ngOnInit() {
    this.headerService.setTitle('home');
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('home_background');
  }

  ngOnDestroy(): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('home_background');
  }
}
