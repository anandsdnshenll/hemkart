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
  timeI : any;
  merchant_phone: any;
  counter: number;
  isWorkOrder: boolean;
  delieveryTime: string;

  constructor(private user:UsersService, private routes: ActivatedRoute, private router: Router) { 
    this.routes.queryParams.subscribe(params => {
      this.order_id = params["order_id"];
    });
    //this.user.orderData$.subscribe(data => this.callTimer(data));
    if(localStorage.getItem("restaurentDetail")) {
      this.merchant_phone = JSON.parse(localStorage.getItem("restaurentDetail"))[0].contact_phone;
    }else {
      this.merchant_phone = '-'
    }

  }

  ngOnInit() {

    if(localStorage.getItem("isWorkorder") == "true") {
      this.isWorkOrder = true;
      this.stopCheckConfirmation = false;
    }else {
      this.isWorkOrder = false;
    }

    this.user.getReciept(this.order_id).subscribe(data => {
      if(data.code == 1) {
        this.enableOrderInfo = true;
        this.orderDetails = data.details;
        this.orderInfo = this.orderDetails.order_info;
        this.customerInfo = this.orderInfo.customer_info;
        this.otherdetails = this.orderDetails.raw;
        this.orderItems = this.otherdetails.item;
        this.orderTotal = this.otherdetails.total;
        if(this.isWorkOrder) {
          this.orderConfirmation(this.order_id);
        }
        //this.user.callConfirmation(this.order_id);
      }
    });
  }

  callTimer() {
    this.timerInterval = setInterval(() => {
      this.counter += 10;
      if(!this.stopCheckConfirmation){
        clearInterval(this.timerInterval);
      } else {
        this.orderConfirmation(this.order_id)
      }
    },5000 * 5);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  continuShop() {
    var page = '';
    if(this.isWorkOrder) {
      page = "workorder";
    }else {
      page = "merchants";
    }
    this.router.navigateByUrl(page);

  }
    
  converToMinutes(s) {
    var c = s.split(':');
    return parseInt(c[0]) * 60 + parseInt(c[1]);
  }

  parseTime(s) {
      return Math.floor(parseInt(s) / 60) + ":" + parseInt(s) % 60
  }
  //var minutes = parseTime(EndTIme) - parseTime(StartTime);
  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes
    return strTime;
  }



  orderConfirmation(data) {
    this.user.checkConfirmation(data).subscribe(data => {
     // console.log("data", data);
      if(data.code == 2) {
        this.callTimer();
        this.stopCheckConfirmation = true;
        //clearInterval(this.timerInterval);
      }
      if(data.code == 1) {
        //console.log("data", data);
        clearInterval(this.timerInterval);
        var startTime = this.converToMinutes(this.formatAMPM(new Date));
        this.delieveryTime = parseInt(this.parseTime(startTime - parseInt(data.details))).toFixed(2);
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
