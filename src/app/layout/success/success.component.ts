import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import * as $ from 'jquery';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  enableOrderInfo = true;
  orderDetails: any = [];
  orderInfo: any = [];
  customerInfo: any = [];
  orderItems: any = [];
  otherdetails: any = [];
  orderTotal: any = [];
  order_id: any;
  stopCheckConfirmation = true;
  confirmationDetails: any = [];
  timerInterval: any;
  timeI = (5000 * 4);
  merchant_phone: any;

  constructor(private user:UsersService, private routes: ActivatedRoute, private router: Router) { 
    this.routes.queryParams.subscribe(params => {
      this.order_id = params["order_id"];
    });
    //this.user.orderData$.subscribe(data => this.callTimer(data));
    this.merchant_phone = JSON.parse(localStorage.getItem("restaurentDetail"))[0].contact_phone;

  }

  ngOnInit() {
    this.user.getReciept(this.order_id).subscribe(data => {
      if(data.code == 1) {
        this.enableOrderInfo = true;
        this.orderDetails = data.details;
        this.orderInfo = this.orderDetails.order_info;
        this.customerInfo = this.orderInfo.customer_info;
        this.otherdetails = this.orderDetails.raw;
        this.orderItems = this.otherdetails.item;
        this.orderTotal = this.otherdetails.total;
        this.orderConfirmation(this.order_id);
        //this.user.callConfirmation(this.order_id);
      }
    });
  }

  callTimer(timeI) {
    console.log("timeI", timeI);
    if(this.stopCheckConfirmation) {
      this.timerInterval = interval(timeI).subscribe(x => {
        this.orderConfirmation(this.order_id)
      });
    }

  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  continuShop() {
    this.router.navigateByUrl('merchants');

  }

  orderConfirmation(data) {
    this.user.checkConfirmation(data).subscribe(data => {
     // console.log("data", data);
      if(data.code == 2) {
       this.callTimer(this.timeI);
        this.stopCheckConfirmation = true;
      }
      if(data.code == 1) {
        //console.log("data", data);
        clearInterval(this.timerInterval);
        this.stopCheckConfirmation = false;
      }
      this.confirmationDetails = data.details;
    });

  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("#navbar-left-brand-tab").hide();
      $(".showScrolledHeader").hide();
      $(".showFixedHeader").show();
    });
  }
}
