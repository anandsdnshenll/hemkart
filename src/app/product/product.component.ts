import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { UsersService } from '../core';

import { Location } from '@angular/common'
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  submitted = false;
  area: any;
  datam: any = [];
  data: any = [];
  datas: any = [];
  lists: any = [];
  img_url:string=environment.image_url;
  constructor(
    private fb: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private http: HttpClient,
    private users: UsersService,
    private router: Router,
    private routes: ActivatedRoute
  ) {
    this.routes.queryParams.subscribe(params => {
      this.area = params["area"];
    });
    this.spinnerService.show();
    console.log(this.area);
    this.users.getArea(this.area).subscribe(data => {
      this.lists = data.details;
      if (this.datas.list != '') {
        this.datam = this.lists.list;
      }
      setTimeout(() => this.spinnerService.hide(), 8000);
      console.log(this.datam);

      //this.valu();
    });
  }

  ngOnInit() {
  }
  ngAfterViewInit() {

    $(document).ready(function () {
      //   $(window).on('load', function () {
      //     $('.offer_bg').show();
      //   });

      $('.customer-logos').slick({

        slidesToShow: 6,

        slidesToScroll: 1,

        autoplay: true,

        autoplaySpeed: 1500,

        arrows: false,

        dots: false,

        centerMode: true,

        pauseOnHover: false,

        responsive: [{

          breakpoint: 1440,

          settings: {

            slidesToShow: 5

          }

        }, {

          breakpoint: 1199,

          settings: {

            slidesToShow: 4

          }

        }, {

          breakpoint: 992,

          settings: {

            slidesToShow: 3

          }

        }, {

          breakpoint: 768,

          settings: {

            slidesToShow: 2

          }

        }, {

          breakpoint: 520,

          settings: {

            slidesToShow: 1

          }

        }]

      });

      $("#navbar-left-brand").click(function () {

        $("#locate-search").show();

        $("#locate-me").show();


      });
      $("#navbar-left-brand").click(function () {
        $("#locate-search").hide();

      })


      $("#navbar-left-brand-tab").click(function () {

        $("#locate-search").show();

        $("#locate-me").show();

      });



      $("#navbar-left-brand-mob").click(function () {

        $("#locate-search").show();

        $("#locate-me").show();

      });
      $(".btn-another-date").click(function () {
        $(".show-another-date").show();
      });

    });
  }

}
