import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/core';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';

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
  restaurentDetail: any = [];
  Image: string;
  enableBanner = true;
  bannersList: any = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private users: UsersService,
    private router: Router,
    private routes: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer
  ) {
    // this.routes.queryParams.subscribe(params => {
    //   this.area = params["area"];
    // });
    this.area = localStorage.getItem("postalCode");
    this.Image  = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 8 6">
    <g class="svg-stroke-container">
        <path fill="none" fill-rule="evenodd" stroke="#FFF" stroke-linecap="round" stroke-linejoin="round" d="M.5 3.333L3.073 5.5 7.5.5"></path>
    </g> </svg>`;
  }

  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
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
    this.getBanners();
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

  
  goRestaurentDetail(merchantid, productImage, availableTypes, restaurant_name, rating_value, isClosed, disabled_cod, terms, contact_phone) {
    this.restaurentDetail.push(
      {
        merchantid: merchantid,
        productImage: productImage,
        availableTypes: availableTypes,
        restaurant_name: restaurant_name,
        rating_value: rating_value,
        isClosed: isClosed,
        disabled_cod: disabled_cod,
        terms: terms,
        contact_phone: contact_phone
      }
    );
    localStorage.setItem("productImage", productImage);
    localStorage.setItem("restaurentDetail", JSON.stringify(this.restaurentDetail));
    this.router.navigate(['/merchants/'], { queryParams: { merchantid: merchantid } });
  }


  ratingValue(value){
    return '('+value.replace(/^\s+|\s+$/g, '')+')';
  }
  
  getBanners(){
    this.users.getBannersList(this.area).subscribe(data=>{
      if(data.code == 1) {
        this.bannersList = data.details;
        this.enableBanner = true;
        console.log("banners--->", this.bannersList);
      } else {
          this.enableBanner = false;
      }
    });
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
      
      $(".showScrolledHeader").css("display","none !important");
      $(".showFixedHeader").css("background","#fff !important");
      $(".showScrolledHeader").hide();
      $(".showFixedHeader").show();

      // $("#navbar-left-brand").click(function () {
      //   $("#locate-search").show();
      //   $("#locate-me").show();
      // });

      // $("#navbar-left-brand").click(function () {
      //   $("#locate-search").hide();
      // })

      // $("#navbar-left-brand-tab").click(function () {
      //   $("#locate-search").show();
      //   $("#locate-me").show();
      // });

      // $("#navbar-left-brand-mob").click(function () {
      //   $("#locate-search").show();
      //   $("#locate-me").show();
      // });

      // $(".btn-another-date").click(function () {
      //   $(".show-another-date").show();
      // });

    });
  }

  closeFielterBox(){
    this.divShowHide = !this.divShowHide; 
  }

}
