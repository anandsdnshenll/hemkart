import { Component, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService, ApiService } from 'src/app/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Directive, ElementRef } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [ToastrService],
})
export class CheckoutComponent implements OnInit {
  @ViewChild("checkoutcontainer") MyContainer: ElementRef;

  LoginForm: FormGroup;
  registerForm: FormGroup;
  instatRegisterForm: FormGroup;
  submitted = false;
  loginsubmitted = false;
  userName: string;
  erroMsg: any;
  isLoggedIn = '';
  user_profile: any = [];
  contact_phone: any;
  alreadyLogin = false;
  availableTypes: any;
  postalCode: string;
  merchantid: any;
  productImage: any;
  rating_value: any;
  restaurant_name: any;
  isClosed: any;
  emptyCarts = false;
  listCart: any = [];
  totalAmt: any = [];
  api_url = localStorage.getItem("image_url");
  disabled_cod: any;
  CODForm: FormGroup;
  CODsubmitted = false;
  instaCODsubmitted = false;
  last_name: any;
  door: any;
  floor: any;
  street: any;
  location_name: any;
  email_address: any;
  zipcode: any;
  showLoginForm = false;
  showRegisterForm = false;
  hideButtons = true;
  enableCODForm = false;
  enableKlarnaForm = false;
  receiptDetails: any = [];
  orderInfo: any = [];
  orderTotal: any = [];
  orderDetails: any = [];
  customerInfo: any =[ ];
  otherdetails: any = [];
  orderItems: any = [];
  confirmationDetails: any = [];
  enableOrderInfo = false;
  regerroMsg: any;
  instErrMsg: any;
  codErrMsg: any;
  totalOrderAmt: any = [];
  cardProcessingFee = 0;
  merchant_phone: any;
  enableSwishForm = false;
  stopCheckConfirmation = true;
  timerInterval: any;
  orderId: any;
  klarnaForm: string;
  showLoad =  false;
  currentMerchantInfo: any = [];
  merchantDetails: any = [];

  constructor(private elementRef: ElementRef, private sanitizer:DomSanitizer, private fb: FormBuilder, private user:UsersService, private router: Router, private toastr: ToastrService, private apiService: ApiService,) {
    this.isLoggedIn = localStorage.getItem("isLoggedin");
    this.postalCode = localStorage.getItem("postalCode");;
    this.merchantid = JSON.parse(localStorage.getItem("restaurentDetail"))[0].merchantid;

    this.LoginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      mobileNumber: ['', Validators.required],
      password: ['', Validators.required],
    });
    

    this.instatRegisterForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      password: ['', Validators.required],
      mobilnumber: [''],
      apartment: [''],
      floor: [''],
      door: [''],
      address: ['', Validators.required],
      information: [''],
      location_name: [''],
      zipcode: [this.postalCode],
    });
    this.user.orderData$.subscribe(data => this.checkConfirmation(data));
    this.getMerchantInfo();
  }

  checkConfirmation(data){
    
    // this.timerInterval = interval(5000 * 2).subscribe(x => {
    //  // console.log("time interval");
    //  this.orderId = data;
    //   this.orderConfirmation(data)

    // });
  }
  get f() { return this.registerForm.controls; }
  get login_Form() { return this.LoginForm.controls; }
  get cod_Form() { return this.CODForm.controls; }
  get instacod_Form() { return this.instatRegisterForm.controls; }

  ngOnInit() {
    if(localStorage.getItem("purchased") == "true"){
      // this.timerInterval = interval(5000 * 2).subscribe(x => {
      //  // console.log("time interval");
      //    this.orderConfirmation(this.orderId)
      // });
    }
    if(!localStorage.getItem("restaurentDetail")){
      this.router.navigate(["/"]);
    }
    this.showKlarnaForm();
    this.userProfileDetails();
    // this.availableTypes = JSON.parse(localStorage.getItem("restaurentDetail"))[0].availableTypes;
    // this.productImage = JSON.parse(localStorage.getItem("restaurentDetail"))[0].productImage;
    // this.rating_value = JSON.parse(localStorage.getItem("restaurentDetail"))[0].rating_value;
    // this.restaurant_name = JSON.parse(localStorage.getItem("restaurentDetail"))[0].restaurant_name;
    // this.isClosed = JSON.parse(localStorage.getItem("restaurentDetail"))[0].isClosed;
    // this.disabled_cod = JSON.parse(localStorage.getItem("restaurentDetail"))[0].disabled_cod;
    // this.merchant_phone = JSON.parse(localStorage.getItem("restaurentDetail"))[0].contact_phone;
    this.delieveryType(localStorage.getItem("delieveryType"));

    // this.user.getReciept(11).subscribe(data => {
    //   console.log("receiptDetails ----->", data);
    //   if(data.code == 1) {
    //     this.enableOrderInfo = true;
    //     this.orderDetails = data.details;
    //     this.orderInfo = this.orderDetails.order_info;
    //     this.customerInfo = this.orderInfo.customer_info;
    //     this.otherdetails = this.orderDetails.raw;
    //     this.orderItems = this.otherdetails.item;
    //     this.orderTotal = this.otherdetails.total;
    //     localStorage.setItem("purchased","true");
    //     //this.user.callConfirmation(11);
    //     this.router.navigate(['/success/'], { queryParams: { order_id: 30 } });

    //   }
    // });
  }

//   ngOnDestroy() {
//     // Will clear when component is destroyed e.g. route is navigated away from.
//     clearInterval(this.timerInterval);
//  }
getMerchantInfo() {
  this.user.getMerchantInfo(this.postalCode, this.merchantid).subscribe(data=>{
    if(data.code == 2) {
      this.currentMerchantInfo = data.details;
      this.merchantDetails = this.currentMerchantInfo.list[0];
      this.availableTypes = this.merchantDetails.resto_cuisine1;
      this.productImage = this.merchantDetails.image;
      this.rating_value = this.merchantDetails.rating_value;
      this.restaurant_name = this.merchantDetails.restaurant_name;
      this.isClosed = this.merchantDetails.resto_sta;
      this.disabled_cod = this.merchantDetails.disabled_cod;
      this.merchant_phone = this.merchantDetails.phone_no;
      // console.log("merchantDetails", this.merchantDetails, "mapLink", this.mapLink);
    } else {
      setTimeout(() => this.toastr.error('Fail', data.msg), 0);
    }
  });
}

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('sticky').innerHTML;
    popupWin = window.open(window.location.href, '_blank', 'height=600,width=650,top=100,left=100');
    // popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <style>
          .your-order {
            text-align: center;
            font-size: 25px;
            font-weight: 600;
            margin-bottom: 0;
            font-size: 24x;

        }
          #sticky {
            padding: 15px;
            background-color: #fff;
            transition: height .4s ease;
            overflow: auto;
            position: -webkit-sticky;
            position: sticky;
            top: 10%;
            font-size: 24x;

          }
          .slide-body_res
          {
            width: 50%;
            margin: 0 auto;
            font-size: 18px;
          }
          .res-ord_list {
            font-size: 24x;
          }
          .res-ord_list {
            font-size: 24x;
            font-weight: 600;
          }
          .padd-zero {
            padding: 0;
          }
          .to_pay_delsumma {
            font-size: 13px;
            color: #464646;
            font-weight: 700;
            text-transform: uppercase;
            padding-right: 30px;
        }
        .to_paysuma {
          padding-right: 30px;
        }
        .to_paysuma {
          padding-right: 30px;
        }
        .to_pay_amt_delsumma {
          font-weight: bold;
        }
        .checkoutBtn {
          display: none;
        }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    
    popupWin.document.close();
  }

  userProfileDetails() {
    this.isLoggedIn = localStorage.getItem("isLoggedin");
    if(this.isLoggedIn == "true") {
      this.alreadyLogin = true;
      this.user_profile = JSON.parse(localStorage.getItem("user_profile"));
      this.userName = this.user_profile.first_name;
      this.email_address = this.user_profile.email_address;
      this.last_name = this.user_profile.last_name;
      this.contact_phone = this.user_profile.contact_phone;
      this.door = this.user_profile.door;
      this.floor = this.user_profile.floor;
      this.street = this.user_profile.street;
      this.location_name = this.user_profile.location_name;
      this.zipcode = this.user_profile.zipcode;

      this.CODForm = this.fb.group({
        mobilnumber: [this.contact_phone, Validators.required],
        apartment: [''],
        floor: [this.floor],
        door: [this.door],
        address: [this.street, Validators.required],
        information: [''],
        first_name: [this.userName],
        last_name: [this.last_name],
        email_address: [this.email_address],
        location_name: [this.location_name],
        zipcode: [this.postalCode],
      });
    }
  }

  orderConfirmation(data) {
    this.user.checkConfirmation(data).subscribe(data => {
      // console.log("data", data);
      if(data.code == 1 && data.masg == "Pending") {
        this.stopCheckConfirmation = true;
        return false;
      }else if(data.code == 1 && data.msg == "Accepted") {
        this.stopCheckConfirmation = false;
        return true;
      }
      this.confirmationDetails = data.details;
    });

  }
  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      localStorage.setItem("purchased","false");
    }
  }

  delieveryType(type){
    this.user.delieveryType(type).subscribe(data=>{
      this.loadCart(this.merchantid);
    });
  }

  showLogin() {
    this.showLoginForm = true;
    this.showRegisterForm = false;
    this.hideButtons = false;
  }

  showRegister() {
    this.hideButtons = false;
    this.showLoginForm = false;
    this.showRegisterForm = true;
  }

  CashForm(){
    this.userProfileDetails();
    this.cardProcessingFee = 0;
    this.enableCODForm = true;
    this.enableKlarnaForm = false;
    this.enableSwishForm = false;
  }

  showKlarnaForm() {
    // console.log("klarna form")
    this.enableCODForm = false;
    this.enableKlarnaForm = true;
    this.enableSwishForm = false;
    this.cardProcessingFee = 5;
    this.user.checkoutKlarna().subscribe(data => {
      this.showLoad = true;
      this.getSnippet(data);
    });
    
  }

  getSnippet(htmlSnippet) {
    this.MyContainer.nativeElement.innerHTML = htmlSnippet
    const scripts = <HTMLScriptElement[]>this.elementRef.nativeElement.getElementsByTagName('script');
    this.showLoad = false;
    const scriptsInitialLength = scripts.length;
    for (let i = 0; i < scriptsInitialLength; i++) {
        const script = scripts[i];
        const scriptCopy = <HTMLScriptElement>document.createElement('script');
        scriptCopy.type = script.type ? script.type : 'text/javascript';
        if (script.innerHTML) {
            scriptCopy.innerHTML = script.innerHTML;
        } else if (script.src) {
            scriptCopy.src = script.src;
        }
        scriptCopy.async = false;
        script.parentNode.replaceChild(scriptCopy, script);
    }
  }

  showSwishForm() {
    this.enableCODForm = false;
    this.enableKlarnaForm = false;
    this.enableSwishForm = true;
    this.cardProcessingFee = 5;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.user.clientRegister(this.registerForm.value).subscribe(data => {
      if(data.code == 1) {
        this.user.clientLogin(this.registerForm.value).subscribe(data => {
          if(data.code == 1) {
            this.alreadyLogin = true;
            localStorage.setItem("user_profile", JSON.stringify(data.details.details));
            localStorage.setItem("isLoggedin", "true");
            localStorage.setItem("token", data.details.token);
            localStorage.setItem("userName", data.details.details.first_name);
            localStorage.setItem("contact_phone", data.details.details.contact_phone);
            this.userName = localStorage.getItem("userName");
            this.contact_phone = localStorage.getItem("contact_phone");
            this.registerForm.reset();
            this.user.loggedUser(data.details.details.first_name);
          } else {
            localStorage.setItem("isLoggedin", "false");
            this.alreadyLogin = false;
          }
        });
      } else {
        this.regerroMsg = data.msg;
      }
    });
  }

  onLogin() {
    this.loginsubmitted = true;
    if (this.LoginForm.invalid) {
        return;
    }
    this.user.clientLogin(this.LoginForm.value).subscribe(data => {
      if(data.code == 2) {
        this.alreadyLogin = false;
        this.erroMsg = data.msg;
        localStorage.setItem("isLoggedin", "false");
      } else {
        this.LoginForm.reset();
        this.alreadyLogin = true;
        localStorage.setItem("isLoggedin", "true");
        localStorage.setItem("user_profile", JSON.stringify(data.details.details));
        localStorage.setItem("token", data.details.token);
        localStorage.setItem("userName", data.details.details.first_name);
        localStorage.setItem("contact_phone", data.details.details.contact_phone);
        this.userName = localStorage.getItem("userName");
        this.contact_phone = localStorage.getItem("contact_phone");
        this.user.loggedUser(this.userName);
        this.userProfileDetails();
      }
      $(document).ready(function () {
        $('.toggle-form1, .toggle-form, .formwrap, .toggle-bg').removeClass('active');
      });
    });
  }

  cashondelievery() {
    this.CODsubmitted = true;
    if (this.CODForm.invalid) {
      return;
    }
    this.user.cashOnDelievery(this.CODForm.value).subscribe(data => {
      // console.log("data ----->", data);
      if(data.code == 1) {
        this.receiptDetails = data.details;
        // this.user.getReciept(this.receiptDetails.order_id).subscribe(data => {
        //   console.log("receiptDetails ----->", data);
        //   if(data.code == 1) {
        //     this.enableOrderInfo = true;
        //     this.orderDetails = data.details;
        //     this.orderInfo = this.orderDetails.order_info;
        //     this.customerInfo = this.orderInfo.customer_info;
        //     this.otherdetails = this.orderDetails.raw;
        //     this.orderItems = this.otherdetails.item;
        //     this.orderTotal = this.otherdetails.total;
        //     this.orderConfirmation(this.receiptDetails.order_id);
        //   }
        // });
        this.ClearCart();
        setTimeout(() => this.toastr.success('Success', 'Your order has been placed.'), 500);
        this.router.navigate(['/success/'], { queryParams: { order_id: this.receiptDetails.order_id } });
      } else {
        this.codErrMsg = data.msg
      }
      // console.log("after cart deleted*****", data);
      // this.CODForm.reset();
    });
  }

  onInstantSubmit() {
    this.instaCODsubmitted = true;
    console.log("this.CODForm.value---->", this.instatRegisterForm.value);
    if (this.instatRegisterForm.invalid) {
      return;
    }
    this.user.CODNewUser(this.instatRegisterForm.value).subscribe(data => {
      // console.log("data ----->", data);
      if(data.code == 1) {
        this.receiptDetails = data.details;
        this.user.getReciept(this.receiptDetails.order_id).subscribe(data => {
          console.log("receiptDetails ----->", data);
          if(data.code == 1) {
            this.enableOrderInfo = true;
            this.orderDetails = data.details;
            this.orderInfo = this.orderDetails.order_info;
            this.customerInfo = this.orderInfo.customer_info;
            this.otherdetails = this.orderDetails.raw;
            this.orderItems = this.otherdetails.item;
            this.orderTotal = this.otherdetails.total;
          }
        });
        this.ClearCart();
        setTimeout(() => this.toastr.success('Success', 'Your order has been placed.'), 500);
      } else {
        this.instErrMsg = data.msg
      }
      // console.log("after cart deleted*****", data);
      // this.CODForm.reset();
    });
    
  }
  ClearCart() {
    this.user.ClearCart().subscribe(data => {
      // console.log("ClearCart*****", data);
      // this.loadCart(this.merchantid);
    });
  }


  loadCart(merchantid) {
    this.user.getCart(this.merchantid).subscribe(data => {
      if(data.code == 1) {
        this.emptyCarts = false;
        let details = data.details;
        this.listCart = details.raw.item;
        this.totalAmt = details.raw.total;
        this.totalOrderAmt = this.totalAmt.total;
        this.user.setAddedCart(data.details['item-count']);
        this.user.currentClientDetails().subscribe(data => {
          // console.log("currentClientDetails*****", data);
        });

        // this.restaurentsDetails = data.details;
        // this.lists = data.details;
        // this.areaRestaurents = this.lists.list;
      } else {
        console.log("cart details*****", data);
        this.listCart = '';
        this.totalAmt = '';
        this.emptyCarts = true;
        this.router.navigate(['/merchants']);

      }
    });
  }

  deleteCart(index){
    this.user.deleteCart(index).subscribe(data => {
        this.loadCart(this.merchantid);
    });
  }

  increaseValue(itemid, qty, price, index){
    this.user.updateCart(itemid, this.merchantid, parseInt(qty) + 1, price, parseInt(index)+1).subscribe(data => {
      this.loadCart(this.merchantid);
    });
  }

  decreaseValue(itemid, qty, price, index){
    let seletedqty = parseInt(qty)-1;
    if(seletedqty == 0) {
      this.deleteCart(index)
    } else {
      this.user.updateCart(itemid, this.merchantid, seletedqty, price, parseInt(index)+1).subscribe(data => {
        this.loadCart(this.merchantid);
        // console.log("after cart updated*****", data);
      });
    }

  }
  
  itemType(type) {
    return type ? "("+ type+")" : "";
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("#navbar-left-brand-tab").hide();
      $(".showScrolledHeader").hide();
      $(".navbar-fixed-top").show();
      $("#navbar-left-brand-mob").hide();
    });
  }


}
