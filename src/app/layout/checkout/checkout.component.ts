import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [ToastrService],
})
export class CheckoutComponent implements OnInit {
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

  constructor(private fb: FormBuilder, private user:UsersService, private router: Router, private toastr: ToastrService,) {
    this.isLoggedIn = localStorage.getItem("isLoggedin");
    this.postalCode = localStorage.getItem("postalCode");;


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
  }

  get f() { return this.registerForm.controls; }
  get login_Form() { return this.LoginForm.controls; }
  get cod_Form() { return this.CODForm.controls; }
  get instacod_Form() { return this.instatRegisterForm.controls; }
  
  ngOnInit() {
    this.userProfileDetails();
    this.merchantid = JSON.parse(localStorage.getItem("restaurentDetail"))[0].merchantid;
    this.availableTypes = JSON.parse(localStorage.getItem("restaurentDetail"))[0].availableTypes;
    this.productImage = JSON.parse(localStorage.getItem("restaurentDetail"))[0].productImage;
    this.rating_value = JSON.parse(localStorage.getItem("restaurentDetail"))[0].rating_value;
    this.restaurant_name = JSON.parse(localStorage.getItem("restaurentDetail"))[0].restaurant_name;
    this.isClosed = JSON.parse(localStorage.getItem("restaurentDetail"))[0].isClosed;
    this.disabled_cod = JSON.parse(localStorage.getItem("restaurentDetail"))[0].disabled_cod;
    this.merchant_phone = JSON.parse(localStorage.getItem("restaurentDetail"))[0].contact_phone;
    this.delieveryType(localStorage.getItem("delieveryType"));


    // this.user.getReciept(26).subscribe(data => {
    //   console.log("receiptDetails ----->", data);
    //   if(data.code == 1) {
    //     this.enableOrderInfo = true;
    //     this.orderDetails = data.details;
    //     this.orderInfo = this.orderDetails.order_info;
    //     this.customerInfo = this.orderInfo.customer_info;
    //     this.otherdetails = this.orderDetails.raw;
    //     this.orderItems = this.otherdetails.item;
    //     this.orderTotal = this.otherdetails.total;
    //   }
    // });



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
    console.log("----->", this.isLoggedIn)
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

  orderConfirmation() {
    this.user.checkConfirmation(11).subscribe(data => {
      console.log("checkConfirmation ----->", data);
      this.confirmationDetails = data.details
    });

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
    console.log("klarna form")
    this.enableCODForm = false;
    this.enableKlarnaForm = true;
    this.enableSwishForm = false;
    this.cardProcessingFee = 5;
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
    console.log("this.CODForm.value", this.CODForm.value);

    if (this.CODForm.invalid) {
      return;
    }
    this.user.cashOnDelievery(this.CODForm.value).subscribe(data => {
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
      console.log("after cart deleted*****", data);
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
    //   function sticky_relocate() {
    //     var window_top = parseFloat($(window).scrollTop());
    //     var footer_top = parseFloat($(".fooder_bg").offset().top);
    //     var div_top = parseFloat($('#sticky-anchor').offset().top);
    //     var div_height = parseFloat($("#sticky").height());             
    //     if (window_top + div_height > footer_top)
    //         $('#sticky').removeClass('stick');    
    //     else if (window_top > div_top) {
    //         $('#sticky').addClass('stick');
    //     } else {
    //         $('#sticky').removeClass('stick');
    //     }
    // }
    
    // $(function () {
    //     $(window).scroll(sticky_relocate);
    //     sticky_relocate();
    // });

      $("#navbar-left-brand-tab").hide();
      $(".showScrolledHeader").hide();
      $(".showFixedHeader").show();

    });
  }


}
