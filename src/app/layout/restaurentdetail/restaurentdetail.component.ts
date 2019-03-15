import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ListfoodModal } from '../listfood-modal/listfood-modal.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from "axios";
import { AddreviewComponent } from '../addreview/addreview.component';

@Component({
  providers: [ToastrService],
  selector: 'app-restaurentdetail',
  templateUrl: './restaurentdetail.component.html',
  styleUrls: ['./restaurentdetail.component.css']
})
export class Restaurentdetail implements OnInit {
  @ViewChild("menucategoryid2") MyProp: ElementRef;
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
  showCartModal = false;
  postalCode: any;
  addedCart: any = [];
  listCart: any = [];
  totalAmt: any = [];
  testVal: string;
  emptyCarts = false;
  terms: any;
  cartDetails: any = [];
  added_sub_item: any = [];
  removedItems: string;

  constructor(
    private router: Router,
    private UsersService: UsersService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private routes: ActivatedRoute,
    myElement: ElementRef,
    
  ) { 

  }

  ngOnInit() {
    // this.routes.queryParams.subscribe(params => {
    //   this.postalCode = params["area"];
    // });
    this.postalCode = localStorage.getItem("postalCode");;

    // console.log("postalCode", this.postalCode);
    this.merchantid = JSON.parse(localStorage.getItem("restaurentDetail"))[0].merchantid;
    this.availableTypes = JSON.parse(localStorage.getItem("restaurentDetail"))[0].availableTypes;
    this.productImage = JSON.parse(localStorage.getItem("restaurentDetail"))[0].productImage;
    this.rating_value = JSON.parse(localStorage.getItem("restaurentDetail"))[0].rating_value;
    this.restaurant_name = JSON.parse(localStorage.getItem("restaurentDetail"))[0].restaurant_name;
    this.isClosed = JSON.parse(localStorage.getItem("restaurentDetail"))[0].isClosed;
    this.terms = JSON.parse(localStorage.getItem("restaurentDetail"))[0].terms;
    this.loadCart(this.merchantid);
    this.api_url = localStorage.getItem("image_url");
    this.spinner.show();

    this.UsersService.getRestaurent(this.merchantid).subscribe(data => {
      if(data.details) {
        // console.log("datatas*****", data.details);
        this.restaurentsDetails = data.details;
        this.spinner.hide();
        // this.lists = data.details;
        // this.areaRestaurents = this.lists.list;
        this.UsersService.getReviews(this.merchantid).subscribe(data => {
          if(data.details) {
            // console.log("datatas*****", JSON.stringify(data.details));
            this.allReviews = data.details;
          } else {
            this.emptyReviews = data.msg;
          }
        });
      } else {
        this.spinner.hide();
        // this.emptyMsg = data.msg;
      }
    });
  }

  
  showReviewModel() {
    const modalRef = this.modalService.open(AddreviewComponent);
    modalRef.componentInstance.merchantid = this.merchantid;
    modalRef.result.then((result) => {
      // console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }
  
  addToCart(itemid, price) {
    // this.spinner.show();
    let qty = 1;
    // if(price.size == "Standard") {
    //   this.UsersService.addtoCart(itemid, this.merchantid, price.price, qty).subscribe(data => {
    //     // console.log("after cart added*****", data);
    //     if(data) {
    //       // this.spinner.hide();
    //       this.setDelievery('delivery');
    //       this.loadCart(this.merchantid);
    //       //  setTimeout(() => this.toastr.success('Success', 'Food Item added to cart'), 0);
    //     } else {
    //       // this.emptyMsg = data.msg;
    //     }
    //   });

    // } else {
      // console.log("inside *****");
      const modalRef = this.modalService.open(ListfoodModal);
      modalRef.componentInstance.itemId = itemid;
      modalRef.componentInstance.merchantid = this.merchantid;
      modalRef.componentInstance.itemPrice = price;
      modalRef.result.then((result) => {
        this.setDelievery('delivery')
      }).catch((error) => {
        console.log(error);
      });
    // }

  }

  setDelievery(type){
    localStorage.setItem("delieveryType",type);
    this.UsersService.delieveryType(type).subscribe(data=>{
      if(data.code == 1) {
        this.loadCart(this.merchantid);
      } else {
        setTimeout(() => this.toastr.success('Fail', data.msg), 0);
      }
    });
  }

  loadCart(merchantid) {
    this.UsersService.getCart(this.merchantid).subscribe(data => {
      if(data.code == 1) {
        this.emptyCarts = false;
        this.cartDetails = data.details;
        this.listCart = data.details.raw.item;
        this.totalAmt = data.details.raw.total;
        this.addedCart = data.details['item-count'];
        this.UsersService.setAddedCart(this.addedCart);

          for(var j = 0; j< this.listCart.length; j++) {
            if(this.listCart[j].sub_item) {
              //console.log("inside", this.listCart[j].sub_item);
              let addOnItems = '';

              this.added_sub_item = this.listCart[j].sub_item;
              for (let i = 0; i < this.listCart[j].sub_item.length; i++) {
                if(this.listCart[j].sub_item[i].removed && this.listCart[j].sub_item[i].default) {
                  addOnItems += " -"+this.listCart[j].sub_item[i].addon_name + ",";
                } 
                if(!this.listCart[j].sub_item[i].removed && this.listCart[j].sub_item[i].default){
                  addOnItems += " "+this.listCart[j].sub_item[i].addon_name + ",";
                } 
                if(!this.listCart[j].sub_item[i].default){
                  addOnItems += " +"+this.listCart[j].sub_item[i].addon_name + ",";
                }
                this.listCart[j].addOnItems = addOnItems;
              }
          }
        }

      } else {
        this.listCart = '';
        this.totalAmt = '';
        this.emptyCarts = true;
        this.UsersService.setAddedCart(0);
      }
    });
  }

  deleteCart(index){
    this.UsersService.deleteCart(index).subscribe(data => {
      if(data.code == 1) {
        this.loadCart(this.merchantid);
      } else {
        setTimeout(() => this.toastr.success('Fail', data.msg), 0);
      }
    });
  }

  increaseValue(itemid, qty, price, index){
    // console.log('index', index);
    this.UsersService.updateCart(itemid, this.merchantid, parseInt(qty) + 1, price, parseInt(index)+1 ).subscribe(data => {
      if(data.code == 1) {
        this.loadCart(this.merchantid);
      } else {
        setTimeout(() => this.toastr.success('Fail', data.msg), 0);
      }
    });
  }

  decreaseValue(itemid, qty, price, index){
    let seletedqty = parseInt(qty)-1;
    if(seletedqty == 0) {
      this.deleteCart(index)
    } else {
      this.UsersService.updateCart(itemid, this.merchantid, seletedqty, price, parseInt(index)+1).subscribe(data => {
        if(data.code == 1) {
          this.loadCart(this.merchantid);
        } else {
          setTimeout(() => this.toastr.success('Fail', data.msg), 0);
        }
        this.loadCart(this.merchantid);
        // console.log("after cart updated*****", data);
      });
    }

  }
  
  itemType(type) {
    return type ? "("+ type+")" : "";
  }

  // gotoTop() {
    
  //   // console.log("id", id);
  //   this.MyProp.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
  // }

  gotoTop(el: HTMLElement) {
    el.scrollIntoView();
  }

  goToCheckout() {
    this.router.navigateByUrl('checkout');
  }
  
  ngAfterViewInit() {

    $(document).ready(function () {
      $(".showScrolledHeader").hide();
      $(".showFixedHeader").show();
      $(".restaruentTabs").css("margin-bottom","298px");
      $("#addToCart").click(function(){
        $("#myModal").modal();
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
