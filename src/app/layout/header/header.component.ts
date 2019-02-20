import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/core';
import { HeaderService } from 'src/app/header.service';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('input_geo_location') postalCodeDiv: ElementRef;
  screenHeight: any;
  screenWidth: any;
  searchs = false;
  cSearchForm: FormGroup;
  data:any;
  result:any;
  postalcode:any='';
  title="";
  registerForm: FormGroup;
  LoginForm: FormGroup;
  submitted = false;
  userName: any;
  erroMsg: any;
  loginsubmitted = false;
  
  constructor(
    private fb: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private router: Router,
    private user:UsersService,
    private activeRoute:ActivatedRoute,
    private headerService:HeaderService
  ) {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(),800);
    this.userName = localStorage.getItem("userName") ? localStorage.getItem("userName") : "";

  }
  ngOnInit() {
    this.cSearchForm = this.fb.group({
      search_address: ['', Validators.required],
      search_address_city: ['']
    });
    this.headerService.title.subscribe(title => {
      this.title = title;
      console.log(title);
    });
    console.log("header",this.activeRoute);
    console.log(this.activeRoute.snapshot['_routerState'].url); 

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      mobileNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.LoginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
  }

  get f() { return this.registerForm.controls; }
  get login_Form() { return this.LoginForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.user.clientRegister(this.registerForm.value).subscribe(data => {
      // if(data.code == 1) {
        this.user.clientLogin(this.registerForm.value).subscribe(data => {
          localStorage.setItem("user_profile", JSON.stringify(data.details.details));
          localStorage.setItem("token", data.details.token);
          localStorage.setItem("userName", data.details.details.first_name);
          this.userName = localStorage.getItem("userName");
          this.registerForm.reset();
          $(document).ready(function () {
            $('.toggle-form1, .formwrap, .toggle-bg').removeClass('active');
          });
        });
      // } else {
      //   this.registerForm.reset();
      // }
    });
  }
  onLogin() {
    this.loginsubmitted = true;
    // stop here if form is invalid
    if (this.LoginForm.invalid) {
        return;
    }
    this.user.clientLogin(this.LoginForm.value).subscribe(data => {
      if(data.code == 2) {
        this.erroMsg = data.msg;
      } else {
        localStorage.setItem("user_profile", JSON.stringify(data.details.details));
        localStorage.setItem("token", data.details.token);
        localStorage.setItem("userName", data.details.details.first_name);
        this.userName = localStorage.getItem("userName");
        this.registerForm.reset();
        $(document).ready(function () {
          $('.toggle-form1, .toggle-form, .formwrap, .toggle-bg').removeClass('active');
        });
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);

  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $(".showScrolledHeader").show();
      $(".showFixedHeader").hide();
      $(window).scroll(function () {
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
      });
      $(window).scroll(function () {
        if ($(".nav-mob").offset().top > 50) {
          //$('#custom-nav').addClass('affix');
          $(".navbar-fixed-top").addClass("top-nav-collapse");
          $('.nav-mob').find('.navbar-brand img').attr('src', './assets/images/red_logo.png'); //change src
          // $('.nav-desktop').find('img').attr('height','22px !important');
        } else {
          // $('#custom-nav').removeClass('affix');
          $(".navbar-fixed-top").removeClass("top-nav-collapse");
          $('.nav-mob').find('.navbar-brand img').attr('src', './assets/images/w_logo.png');
          // $('.nav-desktop').find('img').attr('height','33px !important');
        }
      });
      $(function () {
        $('.cta-open').on('click', function() {
          if(!this.userName) {
            $('.toggle-form, .formwrap, .toggle-bg').addClass('active');
            $('.icon-close').addClass('open');
            $('.toggle-form1, .formwrap1, .toggle-bg1').removeClass('active');
            $('.icon-close1').removeClass('open');
          }
      });
     $('.icon-close').on('click', function() {
          $('.toggle-form, .formwrap, .toggle-bg').removeClass('active');
          $('.icon-close').removeClass('open');
      });
        $('.toggle-bg').on('click', function() {        
          $('.toggle-form, .formwrap, .toggle-bg').removeClass('active');
          $('.icon-close').removeClass('open');
      });
        $('.toggle-bg1').on('click', function() {
          $('.toggle-form1, .formwrap1, .toggle-bg1').removeClass('active');
          $('.icon-close1').removeClass('open');
      });
        $('.cta-open1').on('click', function() {
          $('.toggle-form1, .formwrap1, .toggle-bg1').addClass('active');
          $('.icon-close1').addClass('open');
           $('.toggle-form, .formwrap, .toggle-bg').removeClass('active');
          $('.icon-close').removeClass('open');
      });
     $('.icon-close1').on('click', function() {
          $('.toggle-form1, .formwrap1, .toggle-bg1').removeClass('active');
          $('.icon-close1').removeClass('open');
      });
     $('.cta-open3').on('click', function() {
          $('.toggle-form3, .formwrap3, .toggle-bg3').addClass('active');
          $('.icon-close3').addClass('open');
           $('.toggle-form, .formwrap, .toggle-bg').removeClass('active');
          $('.icon-close').removeClass('open');
      });
     $('.icon-close3').on('click', function() {
          $('.toggle-form3, .formwrap3, .toggle-bg3').removeClass('active');
          $('.icon-close3').removeClass('open');
      });
     $('.cta-open4').on('click', function() {
          $('.toggle-form4, .formwrap4, .toggle-bg4').addClass('active');
          $('.icon-close4').addClass('open');
           $('.toggle-form, .formwrap, .toggle-bg').removeClass('active');
          $('.icon-close').removeClass('open');
      });
     $('.icon-close4').on('click', function() {
          $('.toggle-form4, .formwrap4, .toggle-bg4').removeClass('active');
          $('.icon-close4').removeClass('open');
      });
        $("#myBtn").click(function(){
          $("#myModal").modal();
          });
          $(document).scroll(function(){
       $('.myDiv').toggleClass('scrolled', $(this).scrollTop() > 50);
        });
        $(document).scroll(function () {
            var $nav = $(".navbar-fixed-top");
            $nav.toggleClass('scrolled1', $(this).scrollTop() > $nav.height());
        });
        $("#myBtn").click(function () {
            $("#myModal").modal();
        });
        $('.myDiv').toggleClass('scrolled', $(this).scrollTop() > 50);
        $("#navbar-left-brand").click(function () {
            $("#locate-search").toggle();
            $("#locate-me").toggle();
        });
        $("#navbar-left-brand-tab").click(function () {
            $("#locate-search-tab").toggle();
            $("#locate-me-tab").toggle();
        });
        $("#navbar-left-brand-mob").click(function () {
            $("#locate-search-mob").toggle();
            $("#locate-me-mob").toggle();
        });
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
