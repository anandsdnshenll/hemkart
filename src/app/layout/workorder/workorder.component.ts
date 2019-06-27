import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/core';
import { SelectcityComponent } from '../selectcity/selectcity.component';
import { ListfoodModal } from '../listfood-modal/listfood-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'underscore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workorder',
  templateUrl: './workorder.component.html',
  styleUrls: ['./workorder.component.css']
})
export class WorkorderComponent implements OnInit {
  // city;
  menuDetails: any = [];
  selctedCity: any;
  merchantid: any;
  listCart: any = [];
  emptyCarts = true;
  cartDetails: any = [];
  totalAmt: any = [];
  addedCart: any = [];
  added_sub_item: any = [];
  modalOption: NgbModalOptions = {};
  companyDetails: any = [];
  selctedAddressId: any;
  currentAddress: any = [];
  showCartSec = false;
  emptyDetails: string;
  
  constructor(private router: Router, private modalService: NgbModal, private UsersService: UsersService, private spinner: NgxSpinnerService, private toastr: ToastrService,) { }

  ngOnInit() {
    this.getCity();
    localStorage.setItem("isWorkorder", "true");
  }

  setCity() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(SelectcityComponent, this.modalOption);
    modalRef.result.then((result) => {
      this.getCity()
    }).catch((error) => {
      console.log(error);
    });
  }

  getCity() {
    this.spinner.show();
    this.UsersService.getWorkCompany().subscribe(data => {
      this.spinner.hide();
      if(data.code == 1) {
        this.currentAddress = data.details[0];
        this.selctedCity = this.currentAddress.city;
        this.getWorkMenu(this.selctedCity);
      } else {
        this.setCity();
      }
    });
  }

  itemType(type) {
    return type ? "("+ type+")" : "";
  }

  getWorkMenu(selctedCity) {
    this.UsersService.getWorkMenu(selctedCity).subscribe(data => {
      if(data.code == 1) {
        if(data.details) {
          this.menuDetails = data.details;
          this.emptyDetails = '';
        } else {
          this.menuDetails = [];
          this.emptyDetails = "Somthing gick fel!"
        }
        this.loadCart(0);
      }
    });
  }

  addToCart(item_index, itemid, price, action, cartSubItems, qty, size_words, isownpizza, issubMenu, merchantid) {
    this.spinner.show();
    const modalRef = this.modalService.open(ListfoodModal);
    modalRef.componentInstance.itemId = itemid;
    modalRef.componentInstance.merchantid = merchantid;
    modalRef.componentInstance.itemPrice = price;
    modalRef.componentInstance.action = action;
    modalRef.componentInstance.cartSubItems = cartSubItems;
    modalRef.componentInstance.item_index = item_index;
    modalRef.componentInstance.size_words = size_words;
    modalRef.componentInstance.item_qty = parseInt(qty);
    modalRef.componentInstance.issubMenu = issubMenu;
    modalRef.componentInstance.isownpizza = isownpizza;
    setTimeout(() => this.spinner.hide(), 500);
    modalRef.result.then((result) => {
       this.loadCart(0);
    }).catch((error) => {
      console.log(error);
    });
  }

  updateToCart(item_index, itemid, price, action, cartSubItems, qty, size_words, merchantid) {
    const itemId = itemid;
    var selectedCategory = this.menuDetails.filter((ch) => { 
      return _.find(ch, function (item) { return _.find(item, function (item) { return item.item_id == itemId.toString() }); });
     }).map((ch) => { return ch });

     // this.spinner.show();
      this.modalOption.backdrop = 'static';
      this.modalOption.keyboard = false;
      const modalRef = this.modalService.open(ListfoodModal, this.modalOption);
      modalRef.componentInstance.itemId = itemid;
      modalRef.componentInstance.merchantid = merchantid;
      modalRef.componentInstance.itemPrice = price;
      modalRef.componentInstance.action = action;
      modalRef.componentInstance.cartSubItems = cartSubItems;
      modalRef.componentInstance.item_index = item_index;
      modalRef.componentInstance.size_words = size_words;
      modalRef.componentInstance.item_qty = parseInt(qty);
      modalRef.componentInstance.issubMenu = selectedCategory[0].submenu;
      modalRef.componentInstance.isownpizza = selectedCategory[0].ownpizza;
      modalRef.componentInstance.restaurentsDetails = this.menuDetails;
      modalRef.componentInstance.selectedCategory = selectedCategory;

      modalRef.result.then((result) => {
        this.loadCart(0);
      }).catch((error) => {
        console.log(error);
      });
  }


  addAddOnDefaultItems(itemid, qty, price, index, cartData, merchantid) {
    this.merchantid = merchantid;
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
        setTimeout(() => this.toastr.success(data.msg), 1000);
        this.loadCart(this.merchantid);
      } else {
        setTimeout(() => this.toastr.error('Fail', data.msg), 1000);
      }
    });
  }

  addToCartwithoutAddOnItems(itemid, qty, price, index, cartData, merchantid) {
    this.UsersService.addtoCart(itemid, merchantid, price, qty, 'edit', index, cartData.size_words).subscribe(data => {
      if(data.code == 1) {
        setTimeout(() => this.toastr.success(data.msg), 1000);
        this.loadCart(this.merchantid);
      } else {
        setTimeout(() => this.toastr.error('Fail', data.msg), 1000);
        // this.emptyMsg = data.msg;
      }
    });
  }

  deleteCart(index){
    if(confirm("Är du säker?")) {
      this.UsersService.deleteCart(index).subscribe(data => {
        if(data.code == 1) {
          this.loadCart(this.merchantid);
        } else {
          setTimeout(() => this.toastr.error('Fail', data.msg), 0);
        }
      });
    }
  }

  increaseValue(itemid, qty, price, index, cartData, merchantid){
    let seletedqty = parseInt(qty) + 1;
    if(cartData.sub_item) {
      this.addAddOnDefaultItems(itemid, seletedqty, price, index, cartData, merchantid);
    } else {
      this.addToCartwithoutAddOnItems(itemid, seletedqty, price, index, cartData, merchantid);
    }
  }

  
  decreaseValue(itemid, qty, price, index, cartData, merchantid){
    let seletedqty = parseInt(qty)-1;
    if(seletedqty == 0) {
      this.deleteCart(index)
    } else {
      if(cartData.sub_item) {
        this.addAddOnDefaultItems(itemid, seletedqty, price, index, cartData, merchantid);
      } else {
        this.addToCartwithoutAddOnItems(itemid, seletedqty, price, index, cartData, merchantid);
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
        this.listCart = [];
        this.totalAmt = [];
        this.emptyCarts = true;
        this.UsersService.setAddedCart(0);
      }
    });
  }

  goToCheckout() {
    this.router.navigateByUrl('PaymentOption');
  }

  showCart() {
    $(document).ready(function () {
      $(".showFixedHeader").hide();
      $(".showFixedHeadermob").removeClass("visible-xs");
      $("#sticky").removeClass("hidden-xs");
    });
    this.showCartSec = true;
  }

  closeCart() {
    this.showCartSec = false;
    $(document).ready(function () {
      $(".showFixedHeader").show();
      $(".showFixedHeadermob").addClass("visible-xs");
      $("#sticky").addClass("hidden-xs");
    });
  }

  ngAfterViewInit() {

    $(document).ready(function () {
      $(".showScrolledHeader").hide();
      $("#navbar-left-brand-tab").show();
      $(".showFixedHeader").show();

    });
    $('.checkattr').click(function(){                   
      if($(this).parents('.checkcontainer').hasClass('active')){
         $(this).parents('.checkcontainer').removeClass('active');
      }else{
         $(this).parents('.checkcontainer').addClass('active');
      }         
   })
  }
}
