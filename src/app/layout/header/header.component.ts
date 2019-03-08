import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, Route, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { UsersService } from 'src/app/core';
import { HeaderService } from 'src/app/header.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';


declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ToastrService],

})
export class HeaderComponent implements OnInit {
  @ViewChild('input_geo_location') postalCodeDiv: ElementRef;
  screenHeight: any;
  screenWidth: any;
  searchs = false;
  cSearchForm: FormGroup;
  data:any;
  result:any;
  postalcode = localStorage.getItem("postalCode") ? localStorage.getItem("postalCode") : ' 123';
  title="";
  registerForm: FormGroup;
  LoginForm: FormGroup;
  submitted = false;
  userName: any;
  erroMsg: any;
  loginsubmitted = false;
  locateSearchTab= false;
  geoLoading = false;
  input: any;
  userData: any = [];
  currentRoute = localStorage.getItem("currentRoute");
  loginform = false;
  registerform = false;
  regerroMsg: any;
  merchantid: any;
  addedCart = 0;
  enableForgetForm = false;
  forgetsForm: FormGroup;
  forgetsubmitted = false;
  forgeterroMsg: any;
  enableProfileForm = false;
  userDetails:any = [];
  profileForm: FormGroup;
  profilesubmitted = false;

  constructor(
    private fb: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private router: Router,
    private user:UsersService,
    private activeRoute:ActivatedRoute,
    private headerService:HeaderService,
    private routes: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(),800);
    this.user.cartData$.subscribe(data => this.addedCart = data);

    this.userName = localStorage.getItem("userName") ? localStorage.getItem("userName") : "";
    if(!this.userName){
      this.user.apiData$.subscribe(data => this.userName = data);
    }
    
    this.user.postalData$.subscribe(data => this.postalcode = data);
    localStorage.setItem("image_url", environment.image_url)
  }

  ngOnInit() {
    if(localStorage.getItem("restaurentDetail")) {
      this.loadCart();
    }
    this.postalcode = localStorage.getItem("postalCode");

    this.cSearchForm = this.fb.group({
      search_address: ['', Validators.required],
      search_address_city: ['']
    });
    this.headerService.title.subscribe(title => {
      this.title = title;
    });

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', Validators.compose([Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      mobileNumber: ['', Validators.required],
      password: ['', [Validators.required]]
    });

    this.LoginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      password: ['', [Validators.required]]
    });

    this.forgetsForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
    }); 
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required]],
      apartment: [this.userDetails.location_name],
      floor: [''],
      door: [''],
      address: [''],
      zipcode: [''],
    });
  }

  loadCart() {
    this.merchantid = JSON.parse(localStorage.getItem("restaurentDetail"))[0].merchantid;

    this.user.getCart(this.merchantid).subscribe(data => {
      if(data.code == 1) {
        this.addedCart = data.details['item-count'];
        console.log("this.addedCart", this.addedCart);
      }
    });
  }

  
  get f() { return this.registerForm.controls; }
  get login_Form() { return this.LoginForm.controls; }
  get forgetForm() { return this.forgetsForm.controls; }
  get profile_Form() { return this.profileForm.controls; }
  
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
            localStorage.setItem("user_profile", JSON.stringify(data.details.details));
            localStorage.setItem("isLoggedin", "true");
            localStorage.setItem("token", data.details.token);
            localStorage.setItem("userName", data.details.details.first_name);
            this.userName = localStorage.getItem("userName");
          } else {
            localStorage.setItem("isLoggedin", "false");
          }
          this.registerForm.reset();
          this.closeAllForm();
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
        localStorage.setItem("isLoggedin", "false");
        this.erroMsg = data.msg;
      } else {
        localStorage.setItem("user_profile", JSON.stringify(data.details.details));
        localStorage.setItem("isLoggedin", "true");
        localStorage.setItem("token", data.details.token);
        localStorage.setItem("userName", data.details.details.first_name);
        this.userName = localStorage.getItem("userName");
        this.registerForm.reset();
        this.closeAllForm();
        // this.profile();
      }
    });
  }

  showPostalSearch() {
      this.locateSearchTab = !this.locateSearchTab; 
  }

  onSearch() {
    this.input= this.postalcode;
    if(this.postalcode) {
      this.postalcode = this.postalcode;
    } else {
      this.postalcode = $('.cSearchInput').val();
    }
    // this.spinnerService.show();
    localStorage.setItem("postalCode", this.postalcode);
    $('.cSearchInput').attr('value', this.postalcode);
    this.locateSearchTab = !this.locateSearchTab;
    // setTimeout(() => this.spinnerService.hide(), 1000);
    if(environment.production) {
      window.location.href = "../hemkrtochklarts/allmerchants";
    } else {
      window.location.href = "../allmerchants";
    }
  }

  onGeoloc() {
    this.spinnerService.show();
    this.geoLoading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.user.getLocation(position.coords.latitude, position.coords.longitude).subscribe(results => {
          for(var i=0;i<results.length;++i){
            if(results[i].types[0]=="postal_code"){
              this.postalcode = results[i].long_name;
            }
          }
          if (!this.postalcode) {
            //Postal Code Not found
          }else {
            localStorage.setItem("postalCode", this.postalcode);
            this.cSearchForm.controls['search_address'].setValue(this.postalcode);
            $('.cSearchInput').attr('value',this.postalcode);
             //Postal Code found
          }
          this.geoLoading = false;
          setTimeout(() => this.spinnerService.hide(), 1500);
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  // profile() {
  //   this.user.getProfile(this.userName).subscribe(data => {
  //     console.log("user profile", data);
  //   });
  // }

  ngAfterViewInit() {
    this.postalcode = localStorage.getItem("postalCode");
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        localStorage.setItem("currentRoute", e.url);
        this.callJquery(e.url);
      }
    });
  }


  openLoginForm() {
    if(!this.userName) {
      this.registerform = false;
      this.loginform = true;
      this.enableForgetForm = false;
    }
  }

  hideLoginForm() {
    this.loginform = false;
  }

  showRegisterForm() {
    this.registerform = true;
  }

  hideRegisterForm() {
    this.registerform = false;
    this.loginform = false;
    this.enableForgetForm = false;
    this.enableProfileForm = false;

  }

  closeAllForm() {
    this.registerform = false;
    this.loginform = false; 
  }

  openForgot() {
    this.enableForgetForm = true;
    this.registerform = false;
    this.loginform = false;
  }

  sendForgetForm() {
    this.forgetsubmitted = true;
    if (this.forgetsForm.invalid) {
        return;
    }
    this.user.ForgotPassword(this.forgetsForm.value).subscribe(data => {
      if(data.code == 2) {
        this.forgeterroMsg = data.msg;
      } else {
        this.hideRegisterForm();
        setTimeout(() => this.toastr.success('Success', data.msg), 500);
      }
    });
  }

  // showProfileForm() {
  //   this.enableProfileForm = true;
  //   this.enableForgetForm = false;
  //   this.registerform = false;
  //   this.loginform = false;
  // }

  // profile() {
  //   this.user.currentClientDetails().subscribe(data => {
  //     this.userDetails = data.details;
  //     console.log("currentClientDetails*****", this.userDetails);
      
  //     this.profileForm = this.fb.group({
  //       firstName: [this.userDetails.first_name, Validators.required],
  //       lastName: [this.userDetails.last_name],
  //       email: [this.userDetails.email_address],
  //       password: [this.userDetails.password],
  //       mobileNumber: [this.userDetails.contact_phone, Validators.required],
  //       apartment: [this.userDetails.location_name],
  //       floor: [this.userDetails.floor],
  //       door: [this.userDetails.door],
  //       address: [this.userDetails.street],
  //       zipcode: [this.userDetails.zipcode],
  //     });
  //     // console.log("currentClientDetails*****", data);
  //   });
  // }

  updateProfileForm() {
    this.profilesubmitted = true;
    if (this.profileForm.invalid) {
        return;
    }
    console.log("profileForm==>", this.profileForm.value);
  }
  callJquery(currentRoute){
    this.currentRoute = currentRoute;
    // console.log("this.currentRoute", currentRoute);
    $(document).ready(function () {
      $(".showScrolledHeader").show();
      $(".showFixedHeader").hide();
      
        $(window).scroll(function () {
          if(currentRoute == "/home") {
            // alert(currentRoute);
            if (parseInt($(window).scrollTop()) > 50) {
              $('.nav-desktop').find('a.navbar-brand').find('img').attr('src', './assets/images/red_logo.png');
              //$('.nav-desktop').find('img').attr('height','22px !important');
              //change src../assets/images/red_logo.png
              //$('#custom-nav').addClass('affix');
              $(".navbar-fixed-top").addClass("top-nav-collapse");
    
            } else {
              //$('#custom-nav').removeClass('affix');
              $(".navbar-fixed-top").removeClass("top-nav-collapse");
              $('.navbar-brand').find('img').attr('src', './assets/images/w_logo.png');
              // $('.nav-desktop').find('img').attr('height','33px');
            }

            var $nav = $(".navbar-fixed-top");
            $nav.toggleClass('scrolled1', $(this).scrollTop() > $nav.height());
  
          }
        });
        
        $(window).scroll(function () {
        });

        $(document).scroll(function () {
      });


      $(function () {
        $('.myDiv').toggleClass('scrolled', $(this).scrollTop() > 50);
        $('#input_geo_location').blur(function () {
            if ($('#input_geo_location').val() != '') {
                $('#input_geo_location').attr('value', $('#input_geo_location').val());
            } else {
                $('#input_geo_location').attr('value', '');
            }
        });
    });

    });
  }
}
