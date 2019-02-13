import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HeaderService } from './header.service';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  show=true;
  constructor(private activeRoute:ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,private headerService: HeaderService) {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(),800);
   
   }
  title = 'hemkart';
  ngOnInit() {
    this.headerService.title.subscribe(title => {
      this.title = title;
    });
  }
}
