import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    $(document).ready(function () {
      $(".navbar-right").hide();
      $(".showScrolledHeader").hide();
      $(".navbar-left-brand").hide();
      $(".footer").hide();
      $(".cta-open").hide();
      $(".mat-icon").hide();
      $(".showFixedHeader").show();
      
      
    });
  }

}
