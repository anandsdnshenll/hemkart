import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-showrestaurants',
  templateUrl: './showrestaurants.component.html',
  styleUrls: ['./showrestaurants.component.css']
})
export class ShowrestaurantsComponent implements OnInit {
  cityName: any;
  restaurantsName: any = [];
  lists: any = [];
  emptyValu: any;
  restaurentDetail: any = [];

  constructor(private user:UsersService, private routes: ActivatedRoute, private router: Router, ) { 
    this.routes.queryParams.subscribe(params => {
      this.cityName = params["cityName"];
    });

  }

  ngOnInit() {
    this.user.getCity(this.cityName).subscribe(data => {
      if(data.details) {
        // console.log("datatas*****", JSON.stringify(data.details));
        this.lists = data.details;
        this.restaurantsName = this.lists.list;
  
      } else {
        this.emptyValu = data.msg;
      }
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
    localStorage.setItem("restaurentDetail", JSON.stringify(this.restaurentDetail));

    this.router.navigateByUrl('merchants');

    //this.router.navigate(['/merchants/'], { queryParams: { area: localStorage.getItem("postalCode"), merchantid: merchantid } });

  }
  ngAfterViewInit() {

    $(document).ready(function () {
      
      $(".navbar-left-brand").hide();
      $(".showScrolledHeader").hide();
      $(".showFixedHeader").show();


    });
  }

}
