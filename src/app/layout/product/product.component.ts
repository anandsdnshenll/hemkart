import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/core';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  submitted = false;
  area: any;
  areaRestaurents: any = [];
  data: any = [];
  datas: any = [];
  lists: any = [];
  divShowHide = false;
  img_url:string=environment.image_url;
  title="";
  color = 'primary';
  mode = 'determinate';
  value = 50;
  emptyMsg: string;
  filteredItems: any = [];
  foodFilteredItems: any = [];
  checkedItems: any = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private users: UsersService,
    private router: Router,
    private routes: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.routes.queryParams.subscribe(params => {
      this.area = params["area"];
    });
  }

  // ngOnInit() {
  //   this.spinner.show();
  //   let crrentCode = localStorage.getItem("areaCode");
  //   if((this.areaCode == crrentCode) && localStorage.getItem("areaRestaurents") != null ){
  //     this.areaRestaurents = JSON.parse(localStorage.getItem("areaRestaurents"));
  //     setTimeout(() => this.spinner.hide(), 300);
  //   } else {
  //     this.users.getArea(this.areaCode).subscribe(data => {
  //       if(data.details) {
  //         this.lists = data.details;
  //         this.areaRestaurents = this.lists.list;
  //         localStorage.setItem("areaRestaurents", JSON.stringify(this.areaRestaurents));
  //         localStorage.setItem("areaCode", this.areaCode);
  //       } else {
  //         this.emptyMsg = data.msg;
  //       }
  //       this.spinner.hide();
  //     });
  //   }

  // }

  ngOnInit() {
    this.spinner.show();
    this.users.getArea(this.area).subscribe(data => {
      if(data.details) {
        this.lists = data.details;
        this.areaRestaurents = this.lists.list;
      } else {
        this.emptyMsg = data.msg;
      }
      this.spinner.hide();
    });
  }
  
  assignCopy(){
   this.areaRestaurents = this.lists.list;
  }

  
  filterItem(event){
    if(event.target.value && event.keyCode == 13){
      this.spinner.show();
      event.target.value = event.target.value.toString().toLowerCase();
      if(this.foodFilteredItems && this.foodFilteredItems.length>0) {
        this.areaRestaurents = this.foodFilteredItems;
      }
      this.filteredItems = this.areaRestaurents = Object.assign([], this.areaRestaurents).filter(
      category => category.restaurant_name.toLowerCase().includes(event.target.value)
      );
      setTimeout(() => this.spinner.hide(),200);
    } else {
      this.areaRestaurents = this.lists.list;
    }
  }

  checkValue(value) {
    console.log("value *******", value);
    //value = "Casablanca kolgrillsbar";
    if(value){
      value = value.toString().toLowerCase();
      if(this.filteredItems && this.filteredItems.length>0) {
        this.areaRestaurents = this.filteredItems;
      }
      // this.checkedItems.push({resto_cuisine1: value});
      // console.log("this.checkedItems",this.checkedItems);
      // this.checkedItems
      this.foodFilteredItems = this.areaRestaurents = Object.assign([], this.areaRestaurents).filter(
        category => category.resto_cuisine1.toLowerCase().includes(value)
      );
    } else {
      this.areaRestaurents = this.lists.list;
    }
  }
  ngAfterViewInit() {

    $(document).ready(function () {

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
      
      $(".showScrolledHeader").hide();
      $(".showFixedHeader").show();

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

  closeFielterBox(){
    this.divShowHide = !this.divShowHide; 
  }

}
