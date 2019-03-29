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
import { InfomodalComponent } from '../infomodal/infomodal.component';
import { DomSanitizer} from '@angular/platform-browser';
import { PostcodemodalComponent } from '../postcodemodal/postcodemodal.component';
import * as _ from 'underscore';

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
  selectedOption = "delivery";
  operationOurs: any = [];
  currentMerchantInfo: any = [];
  mapLink: string;
  merchantDetails: any = [];
  voucherCode: string;
  disabled_cod: any;

  constructor(
    private router: Router,
    private UsersService: UsersService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private routes: ActivatedRoute,
    myElement: ElementRef,
    private sanitizer: DomSanitizer
  ) { 

  }

  ngOnInit() {
    // this.routes.queryParams.subscribe(params => {
    //   this.merchantid = params["merchantid"];
    // });    
    this.postalCode = localStorage.getItem("postalCode");


    // console.log("postalCode", this.postalCode);
    if(!localStorage.getItem("restaurentDetail")) {
      this.router.navigate(['/home']);
      return false
    }

    this.callRestaurent();
  }


  callRestaurent() {
    this.merchantid = JSON.parse(localStorage.getItem("restaurentDetail"))[0].merchantid;

    if(this.postalCode) {
      this.getMerchantInfo();
    }
    if(!this.postalCode) {
      this.setPostcodes();
    }
  
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

  setPostcodes() {
    const modalRef = this.modalService.open(PostcodemodalComponent);
    modalRef.componentInstance.merchantid = this.merchantid;
    modalRef.result.then((result) => {
      this.callRestaurent();
    }).catch((error) => {
      console.log(error);
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

  omit_special_char(event)
  {   
     var k;  
     k = event.charCode;  //         k = event.keyCode;  (Both can be used)
     return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }

  addToCart(item_index, itemid, price, action, cartSubItems, qty, size_words, isownpizza, issubMenu) {
    // this.spinner.show();
    // if(isownpizza == "false" && issubMenu == "false") {
    //   this.UsersService.addtoCart(itemid, this.merchantid, price.price, qty).subscribe(data => {
    //     if(data.code == 1) {
    //       // this.spinner.hide();
    //       this.setDelievery('delivery');
    //       //setTimeout(() => this.toastr.success('Success', 'Food Item added to cart'), 0);
    //     } else {
    //       setTimeout(() => this.toastr.error('Fail', data.msg), 1000);
    //       // this.emptyMsg = data.msg;
    //     }
    //   });
    // } else{
      //console.log("price *****",price);
      const modalRef = this.modalService.open(ListfoodModal);
      modalRef.componentInstance.itemId = itemid;
      modalRef.componentInstance.merchantid = this.merchantid;
      modalRef.componentInstance.itemPrice = price;
      modalRef.componentInstance.action = action;
      modalRef.componentInstance.cartSubItems = cartSubItems;
      modalRef.componentInstance.item_index = item_index;
      modalRef.componentInstance.size_words = size_words;
      modalRef.componentInstance.item_qty = parseInt(qty);
      modalRef.componentInstance.issubMenu = issubMenu;
      modalRef.componentInstance.isownpizza = isownpizza;
      modalRef.componentInstance.restaurentsDetails = this.restaurentsDetails;
      
      modalRef.result.then((result) => {
        this.setDelievery('delivery')
      }).catch((error) => {
        console.log(error);
      });
  //  }

  }
  
  updateToCart(item_index, itemid, price, action, cartSubItems, qty, size_words) {
    const itemId = itemid;
    var selectedCategory = this.restaurentsDetails.filter((ch) => { 
      return _.find(ch, function (item) { return _.find(item, function (item) { return item.item_id == itemId.toString() }); });
     }).map((ch) => { return ch });

     // this.spinner.show();
     console.log("cartSubItems0", cartSubItems)
      const modalRef = this.modalService.open(ListfoodModal);
      modalRef.componentInstance.itemId = itemid;
      modalRef.componentInstance.merchantid = this.merchantid;
      modalRef.componentInstance.itemPrice = price;
      modalRef.componentInstance.action = action;
      modalRef.componentInstance.cartSubItems = cartSubItems;
      modalRef.componentInstance.item_index = item_index;
      modalRef.componentInstance.size_words = size_words;
      modalRef.componentInstance.item_qty = parseInt(qty);
      modalRef.componentInstance.issubMenu = selectedCategory[0].submenu;
      modalRef.componentInstance.isownpizza = selectedCategory[0].ownpizza;
      modalRef.componentInstance.restaurentsDetails = this.restaurentsDetails;

      modalRef.result.then((result) => {
        this.setDelievery('delivery')
      }).catch((error) => {
        console.log(error);
      });
  }

  getInfo() {
    this.UsersService.GetOperationalHours(this.merchantid, this.selectedOption).subscribe(data=>{
      if(data.code == 1) {
        this.operationOurs = data.details
       // console.log("this.operationOurs", this.operationOurs);
      } else {
        setTimeout(() => this.toastr.error('Fail', data.msg), 0);
      }
    });
  }

  getMerchantInfo() {
    this.UsersService.getMerchantInfo(this.postalCode, this.merchantid).subscribe(data=>{
      if(data.code == 2) {
        this.currentMerchantInfo = data.details;
        this.merchantDetails = this.currentMerchantInfo.list[0];
        this.availableTypes = this.merchantDetails.resto_cuisine1
        this.productImage = this.merchantDetails.image
        this.rating_value = this.merchantDetails.rating_value
        this.restaurant_name = this.merchantDetails.restaurant_name
        this.isClosed = this.merchantDetails.resto_sta
        this.terms = this.merchantDetails.terms
        this.disabled_cod = this.merchantDetails.disabled_cod
        this.loadCart(this.merchantid);
        this.getInfo();
        this.mapLink = "https://www.google.com/maps/embed/v1/place?q="+this.merchantDetails.latitude+ "," + this.merchantDetails.longitude +"key=AIzaSyB9Mobk70l1gEyIywzPG6qH-H-odB0C8xg"
        // console.log("merchantDetails", this.merchantDetails, "mapLink", this.mapLink);
      } else {
        setTimeout(() => this.toastr.error('Fail', data.msg), 0);
      }
    });
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openInfo() {
    const modalRef = this.modalService.open(InfomodalComponent);
    modalRef.componentInstance.merchantid = this.merchantid;
    modalRef.componentInstance.type = 'delievery';
    modalRef.result.then((result) => {
      
    }).catch((error) => {
      console.log(error);
    });
  }

  setDelievery(type){
    this.selectedOption = type;
    localStorage.setItem("delieveryType",type);
    this.UsersService.delieveryType(type).subscribe(data=>{
      if(data.code == 1) {
        this.loadCart(this.merchantid);
      } else {
        setTimeout(() => this.toastr.error('Fail', data.msg), 0);
      }
    });
  }

  applyVoucher() {
    //console.log("voucherCode", this.voucherCode);
    this.UsersService.applyVoucher(this.voucherCode,this.merchantid).subscribe(data=>{
      if(data.code == 1) {
        this.loadCart(this.merchantid);
      } else {
        setTimeout(() => this.toastr.error('Fail', data.msg), 1000);
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
              let addOnPrice = 0;
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
                if(this.listCart[j].sub_item[i].addon_price) {
                  addOnPrice += + parseInt(this.listCart[j].sub_item[i].addon_price);
                }
                this.listCart[j].addOnItems = addOnItems;
                this.listCart[j].addOnPrice = (parseInt(this.listCart[j].discounted_price) + addOnPrice) *  parseInt(this.listCart[j].qty);
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
    if(confirm("Är du säker?")) {
      this.UsersService.deleteCart(index).subscribe(data => {
        if(data.code == 1) {
          this.loadCart(this.merchantid);
        } else {
          setTimeout(() => this.toastr.success('Fail', data.msg), 0);
        }
      });
    }
  }

  increaseValue(itemid, qty, price, index, cartData){
    let seletedqty = parseInt(qty) + 1;
    if(cartData.sub_item) {
      this.addAddOnDefaultItems(itemid, seletedqty, price, index, cartData);
    } else {
      this.addToCartwithoutAddOnItems(itemid, seletedqty, price, index, cartData);
    }
  }

  
  decreaseValue(itemid, qty, price, index, cartData){
    let seletedqty = parseInt(qty)-1;
    if(seletedqty == 0) {
      this.deleteCart(index)
    } else {
      if(cartData.sub_item) {
        this.addAddOnDefaultItems(itemid, seletedqty, price, index, cartData);
      } else {
        this.addToCartwithoutAddOnItems(itemid, seletedqty, price, index, cartData);
      }
    }
  }

  clearCart() {
    if(confirm("Are you sure you want to clear cart?")) {
      this.UsersService.ClearCart().subscribe(data => {
        this.loadCart(this.merchantid);
      });
    }
  }


  addAddOnDefaultItems(itemid, qty, price, index, cartData) {
    let addedItems= '';
    let addedNewItems= '';
    let defaultaddedItems= '';
    let removeDefaultItems= '';
    let cartItems = '';
    let i = 0;
    
    for (;i < cartData.sub_item.length; i++) {
      if(cartData.sub_item[i].default && !cartData.sub_item[i].removed) {
        let key ='sub_item[4]' + "[" +[i]+ "]";
        let value = "&addon_qty[4]"+ "[" +[i]+ "]"+"="+qty;
        let sub_item = cartData.sub_item[i].addon_id+"|0|"+cartData.sub_item[i].addon_name;
        // let sub_item = this.addOnItems[j].sub_item_id+"|"+this.addOnItems[j].price+"|"+this.addOnItems[j].sub_item_name+"|"+j+"||+"+this.addOnItems[j].sub_item_name
        addedItems += key + "="+sub_item+ value + "&";
      }
      if(!cartData.sub_item[i].default && !cartData.sub_item[i].extra) {
        let key ='sub_item[4]' + "[" +[i]+ "]";
        let value = "&addon_qty[4]"+ "[" +[i]+ "]"+"="+qty;
        let sub_item = cartData.sub_item[i].addon_id+"|"+cartData.sub_item[i].addon_price+"|"+cartData.sub_item[i].addon_name+"|"+i+"||+"+cartData.sub_item[i].addon_name
        addedNewItems += key + "="+sub_item+ value + "&";
      }
      if(!cartData.sub_item[i].default && cartData.sub_item[i].extra) {
        let key ='sub_item[4]' + "[" +[i]+ "]";
        let value = "&addon_qty[4]"+ "[" +[i]+ "]"+"="+qty;
        let sub_item = cartData.sub_item[i].addon_id+"|"+cartData.sub_item[i].addon_price+"|"+cartData.sub_item[i].addon_name+"|"+i+"||+"+cartData.sub_item[i].addon_name+"|Extra";
        defaultaddedItems += key + "="+ sub_item + value + "&";
      }
      if(cartData.sub_item[i].default && cartData.sub_item[i].removed) {
        let key ='sub_item[4]' + "[" +[i]+ "]";
        // |||116|-Tomats%C3%A5s
        removeDefaultItems += key + "="+cartData.sub_item[i].addon_id+"|||"+i+"|-"+cartData.sub_item[i].addon_name + "&";
      }
    }
    if(defaultaddedItems) {
      defaultaddedItems = "&" + defaultaddedItems;
    }
    if(removeDefaultItems) {
      removeDefaultItems = "&" + removeDefaultItems;
    }
    cartItems = addedItems + addedNewItems + defaultaddedItems + removeDefaultItems;
    cartItems = cartItems.replace(/&&/g,"&");
    
    this.UsersService.addtoCartAddon(index, 'edit', itemid, this.merchantid, cartItems, cartData.discounted_price, cartData.size_words, qty).subscribe(data => {
    // this.UsersService.updateCart(itemid, this.merchantid, parseInt(qty) + 1, price, parseInt(index)+1 ).subscribe(data => {
      if(data.code == 1) {
        this.loadCart(this.merchantid);
      } else {
        setTimeout(() => this.toastr.success('Fail', data.msg), 0);
      }
    });
  }

  addToCartwithoutAddOnItems(itemid, qty, price, index, cartData) {
    this.UsersService.addtoCart(itemid, this.merchantid, price, qty, 'edit', index).subscribe(data => {
      if(data.code == 1) {
        this.loadCart(this.merchantid);
      } else {
        setTimeout(() => this.toastr.error('Fail', data.msg), 1000);
        // this.emptyMsg = data.msg;
      }
    });
  }
  
  itemType(type) {
    return type ? "("+ type+")" : "";
  }

  // gotoTop() {
    
  //   // console.log("id", id);
  //   this.MyProp.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
  // }

  gotoTop(id) {
    console.log("id", id);
   // el.scrollIntoView();
   (<HTMLInputElement>document.getElementById(id)).scrollIntoView();
  // var elmnt = document.getElementById("content");
  //elmnt.scrollIntoView();
    // this.MyProp.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  goToCheckout() {
    this.router.navigateByUrl('checkout');
  }
  
  ngAfterViewInit() {

    $(document).ready(function () {
      $(".showScrolledHeader").hide();
      $("#navbar-left-brand-tab").show();
      $(".showFixedHeader").show();
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
