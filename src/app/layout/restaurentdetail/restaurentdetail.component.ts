import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  providers: [ToastrService],
  selector: 'app-restaurentdetail',
  templateUrl: './restaurentdetail.component.html',
  styleUrls: ['./restaurentdetail.component.css']
})
export class Restaurentdetail implements OnInit {
  @Input() rating: number;
  productImage: string;
  api_url: string;
  restaurentDetail: any = [];
  availableTypes: any;
  rating_value: any;
  restaurant_name: any;
  isClosed: any;
  merchantid: any;
  restaurentsDetails: any = [];
  allReviews: any = [];
  emptyReviews: any;

  constructor(
    private router: Router,
    private UsersService: UsersService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService

  ) { 
  }

  ngOnInit() {
    this.merchantid = JSON.parse(localStorage.getItem("restaurentDetail"))[0].merchantid;
    this.availableTypes = JSON.parse(localStorage.getItem("restaurentDetail"))[0].availableTypes;
    this.productImage = JSON.parse(localStorage.getItem("restaurentDetail"))[0].productImage;
    this.rating_value = JSON.parse(localStorage.getItem("restaurentDetail"))[0].rating_value;
    this.restaurant_name = JSON.parse(localStorage.getItem("restaurentDetail"))[0].restaurant_name;
    this.isClosed = JSON.parse(localStorage.getItem("restaurentDetail"))[0].isClosed;
    // console.log("this.productImage", (this.rating_value|slice:6:11);
    this.api_url = localStorage.getItem("image_url");
    this.spinner.show();

    this.UsersService.getRestaurent(this.merchantid).subscribe(data => {
      if(data.details) {
        console.log("datatas*****", data.details);
        this.restaurentsDetails = data.details;
        this.spinner.hide();
        // this.lists = data.details;
        // this.areaRestaurents = this.lists.list;
        this.UsersService.getReviews(this.merchantid).subscribe(data => {
          if(data.details) {
            console.log("datatas*****", JSON.stringify(data.details));
            this.allReviews = data.details;
          } else {
            this.emptyReviews = data.msg;
          }
        });
 
      } else {
        // this.emptyMsg = data.msg;
      }
    });
  }

  addToCart(itemid, price) {
    // this.spinner.show();

    this.UsersService.addtoCart(itemid, this.merchantid, price).subscribe(data => {
      if(data) {
        // this.spinner.hide();

        console.log("after cart added*****", data);
        setTimeout(() => this.toastr.success('Success', 'Cart added successfully!'), 1000);

        this.UsersService.getCart(this.merchantid).subscribe(data => {
          if(data) {

            console.log("cart details*****", data);
            // this.restaurentsDetails = data.details;
            // this.lists = data.details;
            // this.areaRestaurents = this.lists.list;
          } else {
            // this.emptyMsg = data.msg;
          }
        });
      } else {
        // this.emptyMsg = data.msg;
      }
    });
  }
  
  ngAfterViewInit() {

    $(document).ready(function () {
      $(".showScrolledHeader").hide();
      $(".showFixedHeader").show();

      $(".restaruentTabs").css("margin-bottom","298px");
      
      $("#navbar-left-brand").click(function(){
      
        $("#locate-search").toggle();
    
        $("#locate-me").toggle();
    
      });
    
    
    
      $("#navbar-left-brand-tab").click(function(){
    
        $("#locate-search-tab").toggle();
    
        $("#locate-me-tab").toggle();
    
      });
    
    
    
      $("#navbar-left-brand-mob").click(function(){
    
        $("#locate-search-mob").toggle();
    
        $("#locate-me-mob").toggle();
    
      });
    


      $('.checkattr').click(function(){                   
        if($(this).parents('.checkcontainer').hasClass('active')){
           $(this).parents('.checkcontainer').removeClass('active');
        }else{
           $(this).parents('.checkcontainer').addClass('active');
        }         
     })
      $(window).on('scroll', function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > 50) {
        $("._8MlDE._1qF_3").stop().animate({height: "65px"},50);
            $('#header_parent').stop().animate({height: "65px"},100);        
            $("._2tuBw._12_oN._3sCWI._12LfL").stop().animate({height: "120px"},0);
            $('#csk').stop().animate({top: "269px"},0);
            $(".H5I6J").hide();
            $(".Z4sK8").hide(); 
            // $("._1BpLF ._1oxxe").stop().animate({visibility: "hidden"},200);
            $("._1BpLF").hide();
        }
        else  {
             $('#header_parent').stop().animate({height: "245px"},300);
             $("._8MlDE._1qF_3").stop().animate({height: "245px"},200);
            $("._2tuBw._12_oN._3sCWI._12LfL").stop().animate({height: "120px"},0); 
            $('#csk').stop().animate({top: "309px"},10);
            $(".H5I6J").show(); 
            $(".Z4sK8").show(); 
            $("._1BpLF").show(); 
        }
    });
      $(".btn-another-date").click(function() {
        $(".show-another-date").show();
    });

    });
  }

}
