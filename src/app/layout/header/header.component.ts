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
  userDatas: any = [];
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
  firstName: any;
  lastName: any;
  password: any;
  email: any;
  mobileNumber: any;
  apartment: any;
  floor: any;
  door: any;
  address: any;
  zipcode: any;
  profileerroMsg: any;

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
      this.user.userData$.subscribe(data => data ? this.profile(): '');
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
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(/^\S*$/)])],
      lastName: ['', Validators.required],
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
      email: [''],
      password: [''],
      mobileNumber: ['', [Validators.required]],
      apartment: [''],
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
      }
    });
  }

  
  get f() { return this.registerForm.controls; }
  get login_Form() { return this.LoginForm.controls; }
  get forgetForm() { return this.forgetsForm.controls; }
  get profile_Form() { return this.profileForm.controls; }
  
  onSubmit() {
    this.submitted = true;
    Object.keys(this.registerForm.controls).forEach((key) => this.registerForm.get(key).setValue(this.registerForm.get(key).value.trim()));
    console.log("this.registerForm", this.registerForm);
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.user.clientRegister(this.registerForm.value).subscribe(data => {
      if(data.code == 1) {
        this.user.clientLogin(this.registerForm.value).subscribe(data => {
          if(data.code == 1) {
            setTimeout(() => this.toastr.success(data.msg), 1000);
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
  Object.keys(this.LoginForm.controls).forEach((key) => this.LoginForm.get(key).setValue(this.LoginForm.get(key).value.trim()));

  this.loginsubmitted = true;
  if (this.LoginForm.invalid) {
      return;
  }
  this.loginMethod(this.LoginForm.value);
}

loginMethod(value) {
  this.user.clientLogin(value).subscribe(data => {
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
      window.location.href = "../hemkort_angular/Restauranglista";
    } else {
      window.location.href = "../Restauranglista";
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
    this.user.logout().subscribe(data => {
      if(data.code == 1) {
        this.user.clearWorkCompanyid().subscribe(data => {
        });
        localStorage.clear();
        this.router.navigate(['/']);
      }
    });
  }
  
  goToMerchant(page) {
    if(page) {
      this.router.navigateByUrl(page);
    }
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

  showProfileForm() {
    this.enableForgetForm = false;
    this.registerform = false;
    this.loginform = false;
    this.profile();

  }

  profile() {
    this.userDetails = JSON.parse(localStorage.getItem("user_profile"));
    this.firstName = this.userDetails.first_name;
    this.lastName = this.userDetails.last_name;
    this.email =this.userDetails.email_address;
    this.password = '';
    this.mobileNumber = this.userDetails.contact_phone;
    this.apartment = this.userDetails.location_name;
    this.floor = this.userDetails.floor;
    this.door = this.userDetails.door;
    this.address = this.userDetails.street;
    this.zipcode = this.userDetails.zipcode;
    this.enableProfileForm = true;
  }

  updateProfileForm() {
    this.profilesubmitted = true;
    Object.keys(this.profileForm.controls).forEach((key) => this.profileForm.get(key).setValue(this.profileForm.get(key).value.trim()));

    if (this.profileForm.invalid) {
      return;
    }
    this.userDatas = {
      first_name: this.firstName,
      last_name: this.lastName,
      email_address: this.email,
      password: this.password,
      contact_phone: this.mobileNumber,
      location_name: this.apartment,
      floor:this.floor,
      door: this.door,
      street: this.address,
      zipcode: this.zipcode
    }
    // console.log("user data", this.userDatas);
    this.user.updateProfile(this.userDatas).subscribe(data => {
      if(data.code == 2) {
        this.profileerroMsg = data.msg;
      } else {
        this.user.currentClientDetails().subscribe(data => {
          if(data.code==1) {
            this.password = '';
            localStorage.setItem("user_profile", JSON.stringify(data.details.details));
            localStorage.setItem("userName", data.details.details.first_name);
            this.userName = localStorage.getItem("userName");
          }
        });
        this.hideRegisterForm();
        setTimeout(() => this.toastr.success('Success', data.msg), 500);
      }
    });
  }

  showOrder() {
    this.router.navigateByUrl('OrderHistory');
  }

  callJquery(currentRoute){
    this.currentRoute = currentRoute;
     
    $(document).ready(function () {
      $(".showScrolledHeader").show();
      $(".showFixedHeader").hide();
      
        $(window).scroll(function () {
          if(currentRoute == "/store") {
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
