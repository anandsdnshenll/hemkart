import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, Route,ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { UsersService } from 'src/app/core';
import { HeaderService } from 'src/app/header.service';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  screenHeight: any;
  screenWidth: any;
  searchs = false;
  cSearchForm: FormGroup;
  data:any;
  result:any;
  postalcode:any='';
  title="";
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
  }
  onSearch() {
    // this.router.navigate(['team', 33, 'user', 11], {relativeTo: route});
    this.searchs = true;
    this.spinnerService.show();
    console.log(this.cSearchForm);
    if (this.cSearchForm.invalid) {
      setTimeout(() => this.spinnerService.hide(), 700);
      return;
    }
    else {
      setTimeout(() => this.spinnerService.hide(), 1000);
      console.log(this.cSearchForm.value);
      this.router.navigate(['/products/'], { queryParams: { area: this.cSearchForm.value.search_address } });
    }

  }
  onGeoloc() {
    this.spinnerService.show();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("latitude=>", position.coords.latitude);
        console.log("longitude=>", position.coords.longitude)
        this.user.getpcode(position.coords.latitude,position.coords.longitude).subscribe(data => {
          this.result = data;
          console.log(data);
          var str =this.result; 
          var n = parseInt(str.search("value"))+7;
          var z=str.search('"/>');
          //console.log(this.result,"n=>",n,"end=>",z)
          console.log(str.slice(n,85));
          var val=str.slice(n,85);
          this.postalcode=val;
          this.cSearchForm.get('search_address').setValue(val);
          setTimeout(() => this.spinnerService.hide(), 1500);
          //this.valu();
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
  ngAfterViewInit() {
    $(document).ready(function () {
      $(window).scroll(function () {
        if (parseInt($(window).scrollTop()) > 50) {
          $('.nav-desktop').find('a.navbar-brand').find('img').attr('src', '../../../assets/images/1428568091-Attachment-1.png');
          //$('.nav-desktop').find('img').attr('height','22px !important');
          //change src../assets/images/1428568091-Attachment-1.png
          //$('#custom-nav').addClass('affix');
          $(".navbar-fixed-top").addClass("top-nav-collapse");

        } else {
          //$('#custom-nav').removeClass('affix');
          $(".navbar-fixed-top").removeClass("top-nav-collapse");
          $('.navbar-brand').find('img').attr('src', '../../../assets/images/w_logo.png');
          // $('.nav-desktop').find('img').attr('height','33px');
        }
      });
      $(window).scroll(function () {
        if ($(".nav-mob").offset().top > 50) {
          //$('#custom-nav').addClass('affix');
          $(".navbar-fixed-top").addClass("top-nav-collapse");
          $('.nav-mob').find('.navbar-brand img').attr('src', '../../../assets/images/1428568091-Attachment-1.png'); //change src
          // $('.nav-desktop').find('img').attr('height','22px !important');
        } else {
          // $('#custom-nav').removeClass('affix');
          $(".navbar-fixed-top").removeClass("top-nav-collapse");
          $('.nav-mob').find('.navbar-brand img').attr('src', '../../../assets/images/w_logo.png');
          // $('.nav-desktop').find('img').attr('height','33px !important');
        }
      });
      $(function () {
        $('.cta-open').on('click', function() {
          $('.toggle-form, .formwrap, .toggle-bg').addClass('active');
          $('.icon-close').addClass('open');
          $('.toggle-form1, .formwrap1, .toggle-bg1').removeClass('active');
          $('.icon-close1').removeClass('open');
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
