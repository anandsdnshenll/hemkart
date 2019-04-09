import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/core';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'underscore';

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
  selectedContent = 0;
  filteredList: any = [];
  selectedVal: any = [];

carouselOptions = {
    margin: 25,
    nav: true,
    dots: false,
    arrows: false,
    slidesToShow: 6,
    autoplay: true,
    autoplaySpeed: 1500,
    responsiveClass: true,
    slidesToScroll: 1,
    responsive: {
      0: {
        items: 1,
        nav: true
      },
      600: {
        items: 1,
        nav: true
      },
      1000: {
        items: 6,
        nav: true,
        loop: false
      },
      1500: {
        items: 6,
        nav: true,
        loop: false
      }
    }
  }
 
  images = [
    {
      text: "Everfresh Flowers",
      image: "https://freakyjolly.com/demo/jquery/PreloadJS/images/1.jpg"
    },
    {
      text: "Festive Deer",
      image: "https://freakyjolly.com/demo/jquery/PreloadJS/images/2.jpg"
    },
    {
      text: "Morning Greens",
      image: "https://freakyjolly.com/demo/jquery/PreloadJS/images/3.jpg"
    },
    {
      text: "Bunch of Love",
      image: "https://freakyjolly.com/demo/jquery/PreloadJS/images/4.jpg"
    },
    {
      text: "Blue Clear",
      image: "https://freakyjolly.com/demo/jquery/PreloadJS/images/5.jpg"
    },
    {
      text: "Evening Clouds",
      image: "https://freakyjolly.com/demo/jquery/PreloadJS/images/7.jpg"
    },
    {
      text: "Fontains in Shadows",
      image: "https://freakyjolly.com/demo/jquery/PreloadJS/images/8.jpg"
    },
    {
      text: "Kites in the Sky",
      image: "https://freakyjolly.com/demo/jquery/PreloadJS/images/9.jpg"
    },
    {
      text: "Sun Streak",
      image: "https://freakyjolly.com/demo/jquery/PreloadJS/images/10.jpg"
    }
  ]

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
    this.setZipCode(this.area);
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
    localStorage.setItem("isWorkorder","false")
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

  
  filterItem(searchString : string){
    if(searchString){
      this.spinner.show();
      searchString = searchString.toString().toLowerCase();
      if(this.foodFilteredItems && this.foodFilteredItems.length>0) {
        this.areaRestaurents = this.foodFilteredItems;
      }
      if(this.areaRestaurents.length == 0) {
        this.areaRestaurents = this.lists.list
        this.filteredItems = this.areaRestaurents = Object.assign([], this.areaRestaurents).filter(
          category => category.resto_cuisine1.toLowerCase().includes(searchString)
        );
      }else {
        this.filteredItems = this.areaRestaurents = Object.assign([], this.areaRestaurents).filter(
          category => category.resto_cuisine1.toLowerCase().includes(searchString)
        );
      }
      setTimeout(() => this.spinner.hide(),200);
    } else {
      this.areaRestaurents = this.lists.list;
    }
  }


  sortByFilter() {
    this.areaRestaurents = this.lists.list;
    if(this.selectedContent == 1) {
      this.areaRestaurents = _.sortBy(this.areaRestaurents, function(result) { return -result.popularity; });
    } else {
      this.areaRestaurents = _.sortBy(this.areaRestaurents, function(result) { return -result.rating_average; });
    }
    this.areaRestaurents = _.uniq(this.areaRestaurents, function (item) {
      return item;
    });
    this.divShowHide = !this.divShowHide;
  }

  setZipCode(postalCode) {
    this.users.setZipcode(postalCode).subscribe(data => {
    });
  }

  checkValue(isChecked, searchString) {
  //  event.stopPropagation();
    if(isChecked) {

      var data = [];
      // this.areaRestaurents = [];
      this.selectedVal.push(searchString.toLowerCase())
      var aa = ''
      for (var i = 0; i < this.selectedVal.length; i++) {
        aa = this.selectedVal[i];
        data = _.filter(this.lists.list, function(person) {
          return person.resto_cuisine1.toLowerCase().includes(aa);
        });
      }
      for (var i = 0; i < data.length; i++) {
        this.filteredList.push(data[i]);
      }
      this.areaRestaurents = this.filteredList;
    }else {
      var data = [];
      this.filteredList = [];
     // console.log("this.lists.list", this.lists.list);

      for (var i=this.selectedVal.length-1; i>=0; i--) {
        if (this.selectedVal[i] === searchString.toLowerCase()) {
          this.selectedVal.splice(i, 1);
        }
      }
      //console.log("this.selectedVal", this.selectedVal);
      var foodType = ''
      for (var i = 0; i < this.selectedVal.length; i++) {
        foodType = this.selectedVal[i].toLowerCase();
        data = _.filter(this.lists.list, function(person) {
          return person.resto_cuisine1.toLowerCase().includes(foodType);
        });
     //   console.log("this.data", data);
        for (var i = 0; i < data.length; i++) {
          this.filteredList.push(data[i]);
        }
      }

      


     // console.log("this.filteredList", this.filteredList);
      // this.areaRestaurents = this.filteredList;
      // if(this.areaRestaurents.length == 0) {
      //   this.areaRestaurents = this.lists.list;
      // }
    }

    if(this.selectedContent == 1) {
      this.areaRestaurents = _.sortBy(this.areaRestaurents, function(result) { return -result.popularity; });
    } else {
      this.areaRestaurents = _.sortBy(this.areaRestaurents, function(result) { return -result.rating_average; });
    }

    this.areaRestaurents = _.uniq(this.areaRestaurents, function (item) {
      return item;
    });
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
      } else {
          this.enableBanner = false;
      }
    });
  }

  ngAfterViewInit() {
    $(document).ready(function () {

      $(".showScrolledHeader").css("display","none !important");
      $(".showFixedHeader").css("display","block !important");
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

  closeFilterBox(){
    this.divShowHide = !this.divShowHide; 
  }

  closeFilterBoxOut() {
    if(this.divShowHide) {
      this.divShowHide = false;
    }
  }
}
