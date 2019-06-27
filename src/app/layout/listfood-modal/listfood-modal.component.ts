import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/core/services/users.service';
import { FormGroup } from '@angular/forms';
import * as _ from 'underscore';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { MatRadioChange } from '@angular/material';

@Component({
  selector: 'app-listfood-modal',
  templateUrl: './listfood-modal.component.html',
  styleUrls: ['./listfood-modal.component.css']
})

export class ListfoodModal implements OnInit {
  @Input() itemId: number;
  @Input() merchantid: number;
  @Input() itemPrice: number;
  @Input() item_index: number;
  @Input() item_qty: number;
  @Input() size_words: string;
  @Input() issubMenu: string;
  @Input() isownpizza: string;
  @Input() action: string;
  @Input() cartSubItems: any = [];
  @Input() restaurentsDetails: any = [];
  
  foodItem: any = [];
  addonForm: FormGroup;
  foodItemDetails: any = [];
  qty = 1;
  seletedAddOnItems: any = [];
  addOnItems: any = [];
  defaultaddOnItems: any = [];
  defaultSelectedOnItems: any = [];
  foodItemPrices: number;
  OriginalfoodItemPrices: number;
  item_id: any;
  addedItems: any = [];
  foodItemSize: any;
  is_default_addon_item = true;
  alreadydefaultSelectedOnItems: any = [];
  selectedContent: any = [];
  foodIncrement: any;
  initialPrice: any;
  default_addon_item: any = [];
  addOnsub_itemItems: any = [];
  default_addon_item_bk: any = [];
  priceIndex = 0;
  errorMsg = false;
  enableButton = true;
  disableAddOnItems = true;
  selectedCategory: any = [];
  hideAll = true;

  constructor(public activeModal: NgbActiveModal, private UsersService: UsersService, private toastr: ToastrService,) { 

  }

  ngOnInit() {
     //console.log("item id***", this.itemId);
     if(this.action == 'add' && this.isownpizza == "false" && this.issubMenu == "false") { 
       $(".modal-content").addClass("hide");
      //  this.hideAll = false;
     }
  }

  ngAfterViewInit() {
    if(this.action == 'edit') {
      this.qty = this.item_qty;
      this.callFoodItem(0);
    }else{
      this.callFoodItem(this.priceIndex);
    }
  }

  callFoodItem(priceIndex) {
    console.log("cart items");

    this.UsersService.GetFoodItem(this.itemId, this.merchantid).subscribe(data => {
      if(data.details) {
        this.item_id = data.details[0].item_id;
        this.foodItem = data.details[0];
        this.foodItemDetails = data.details[0].prices;
        // this.foodIncrement = this.foodItemDetails[priceIndex].increment;
        // this.initialPrice = data.details[0].prices[priceIndex];
        // this.foodItemSize = this.initialPrice.size;
        this.default_addon_item = data.details[0].default_addon_item;
        this.default_addon_item_bk = data.details[0].default_addon_item[0];
        if(!data.details[0].addon_item && this.action != 'edit' || (!this.isownpizza && !this.issubMenu)) {
          this.disableAddOnItems = false;
          this.selectedContent = this.foodItemDetails[priceIndex].price;
          this.initialPrice = data.details[0].prices[priceIndex];
          this.foodItemSize = this.initialPrice.size;
          this.OriginalfoodItemPrices = parseInt(this.foodItemDetails[priceIndex].price);
          this.addToCartnew(this.foodItemDetails[priceIndex].price, this.action);
          return false;
        }
        if(!data.details[0].addon_item && this.action == 'edit') {
          this.disableAddOnItems = false;
          this.selectedContent = this.foodItemDetails[priceIndex].price;
          this.foodItemSize = this.foodItemDetails[priceIndex].size;

          this.foodItemPrices = this.itemPrice;
          this.OriginalfoodItemPrices = parseInt(this.foodItemDetails[priceIndex].price);
          //this.addToCartnew(this.foodItemDetails[priceIndex].price);
          return false;
        }

        this.disableAddOnItems = true;
        this.addOnItems = data.details[0].addon_item[0].sub_item;
        this.addOnsub_itemItems = data.details[0].addon_item[0].sub_item;
        if(this.action== 'edit') {
          let size_words = this.size_words;
          this.foodItemDetails = this.foodItemDetails.filter((ch) => { return ch.size.includes(size_words) }).map((ch) => { return ch });;
          this.foodItemPrices = this.itemPrice;
          this.OriginalfoodItemPrices = parseInt(this.foodItemDetails[priceIndex].price);
          this.foodIncrement = this.foodItemDetails[priceIndex].increment;
          //this.initialPrice = data.details[0].prices[priceIndex];
          this.foodItemSize = this.foodItemDetails[priceIndex].size;
          this.selectedContent  = this.foodItemDetails[priceIndex].price;
        }else {
          this.foodIncrement = this.foodItemDetails[priceIndex].increment;
          this.initialPrice = data.details[0].prices[priceIndex];
          this.foodItemSize = this.initialPrice.size;
          this.foodItemPrices = parseInt(this.initialPrice.price);
          this.OriginalfoodItemPrices = parseInt(this.initialPrice.price);
          this.selectedContent  = data.details[0].prices[priceIndex].price;
        }
        this.getFoodItemDetails();
        } else {
          setTimeout(() => this.toastr.error('Fail', 'Items not found.... pls try again'), 0);
          return false;
      }
    });
  }

  getFoodItemDetails() {
    this.seletedAddOnItems = [];
    this.defaultSelectedOnItems = [];
    this.alreadydefaultSelectedOnItems = [];
    if(this.cartSubItems && this.default_addon_item) {
      this.callEditItems(this.default_addon_item, this.default_addon_item[0].sub_item);
    } else {
      if(this.default_addon_item) {
        this.is_default_addon_item = true;
        this.defaultaddOnItems = this.default_addon_item[0].sub_item;
        for (var i = 0; i < this.addOnItems.length; i++) {
          var ismatch = false; // we haven't found it yet
          //console.log("increment ===>", increment, "this.addOnItems", this.addOnItems, "this.defaultaddOnItems", this.defaultaddOnItems);
          for (var j = 0; j < this.defaultaddOnItems.length; j++) {
            if (this.addOnItems[i].sub_item_id == this.defaultaddOnItems[j].sub_item_id) {
              // we have found this.addOnItems[i]] in this.defaultaddOnItems, so we can stop searching
              ismatch = true;
              this.addOnItems[i].defaultchecked = true; //  checkbox status true
              this.addOnItems[i].checked = true; //  checkbox status true
              this.seletedAddOnItems.push(this.addOnItems[i]);
              this.alreadydefaultSelectedOnItems.push(this.addOnItems[i]);
              this.defaultaddOnItems[j].checked1 = false; //  checkbox status true
              if(this.foodIncrement > 0) {
                let incrementV = (this.addOnItems[i].price / 100) * this.foodIncrement;
                this.addOnItems[i].price = +this.addOnItems[i].price + incrementV;
                let incrementV1 = (this.defaultaddOnItems[j].price / 100) * this.foodIncrement;
                this.defaultaddOnItems[j].price = +this.defaultaddOnItems[j].price + incrementV1;
              }
              this.defaultSelectedOnItems.push(this.defaultaddOnItems[j]);
              break;
            }//End if
            // if we never find this.addOnItems[i].sub_item_id in this.defaultaddOnItems, the for loop will simply end,
            // and ismatch will remain false
          }
          // add this.addOnItems[i] to seletedAddOnItems only if we didn't find a match.
          if (!ismatch) {
            this.addOnItems[i].checked = false; 
            if(this.foodIncrement > 0) {
              let incrementV = (this.addOnItems[i].price / 100) * this.foodIncrement;
              this.addOnItems[i].price = +this.addOnItems[i].price + incrementV;
            }
            this.seletedAddOnItems.push(this.addOnItems[i]);
          } //End if
        }
      } else {
        if(this.cartSubItems) {
          if(this.defaultSelectedOnItems.length>0) {
            this.is_default_addon_item = true;
          }
          console.log("cartSubItems", this.cartSubItems);
          for (var i = 0; i < this.addOnItems.length; i++) {
            var ismatch = false; // we haven't found it yet
            //console.log("increment ===>", increment, "this.addOnItems", this.addOnItems, "this.defaultaddOnItems", this.defaultaddOnItems);
            for (var j = 0; j < this.cartSubItems.length; j++) {
              if ((this.addOnItems[i].sub_item_id == this.cartSubItems[j].addon_id) && this.cartSubItems[j].extra) {
                // we have found this.addOnItems[i]] in this.defaultaddOnItems, so we can stop searching
                console.log("add on id", this.cartSubItems[j].addon_name);
                ismatch = true;
                this.addOnItems[i].defaultchecked = false; //  checkbox status true
                this.addOnItems[i].checked = true; //  checkbox status true
                this.seletedAddOnItems.push(this.addOnItems[i]);
                if(this.cartSubItems[j].addon_name.includes('Extra')) {
                  this.addOnItems[i].checked1 = true;
                  this.defaultSelectedOnItems.push(this.addOnItems[i]);
                } else {
                  this.addOnItems[i].checked1 = false;
                  this.defaultSelectedOnItems.push(this.addOnItems[i]);
                }
                break;
              }else {
                this.addOnItems[i].defaultchecked = false; //  checkbox status true
                this.addOnItems[i].checked = false; //  checkbox status true
                this.seletedAddOnItems.push(this.addOnItems[i]);
              }

            }
          }
          this.defaultSelectedOnItems = _.uniq(this.defaultSelectedOnItems, function (item) {
            return item;
          });
          this.seletedAddOnItems = _.uniq(this.seletedAddOnItems, function (item) {
            return item;
          });
          return false;
        }
        this.is_default_addon_item = false;
        for (var i = 0; i < this.addOnItems.length; i++) {
          var ismatch = false; // we haven't found it yet
          // we have found this.addOnItems[i]] in this.defaultaddOnItems, so we can stop searching
          if(this.foodIncrement > 0) {
            let incrementV = (this.addOnItems[i].price / 100) * this.foodIncrement;
            this.addOnItems[i].price = +this.addOnItems[i].price + incrementV;
          }
          this.addOnItems[i].checked = false; 
          this.seletedAddOnItems.push(this.addOnItems[i]);
        //  break;
        }
      }
    }
    if(this.action == 'add' && this.isownpizza == "false" && this.issubMenu == "false") { 
      this.disableAddOnItems = false;
      this.addTocart("add");
    }
    if(this.action == 'edit') {
      this.disableAddOnItems = true;
      this.selectedContent = this.foodItemDetails[0].price;
      this.foodItemPrices = this.itemPrice;
      this.OriginalfoodItemPrices = parseInt(this.foodItemDetails[0].price);

    }
  }


  toChangePriceBasedIncrement(priceIndex, price) {
    this.foodItemPrices = price;
    this.OriginalfoodItemPrices = price;
    this.addOnItems = [];
    this.callFoodItem(priceIndex);
  }

  callEditItems(default_addon_item, defaultaddOnItems){
    if(default_addon_item) {
      this.is_default_addon_item = true;
      for (var i = 0; i < this.addOnItems.length; i++) {
        var ismatch = false; // we haven't found it yet
        for (var j = 0; j < defaultaddOnItems.length; j++) {
          
          if (this.addOnItems[i].sub_item_id == defaultaddOnItems[j].sub_item_id) {
            // we have found this.addOnItems[i]] in this.defaultaddOnItems, so we can stop searching
            ismatch = true;
            this.addOnItems[i].defaultchecked = true; //  checkbox status true
           // this.addOnItems[i].checked = true; //  checkbox status true
           // this.addOnItems[i].price = 0; //  checkbox status true
           if(this.foodIncrement > 0) {
            let incrementV = (this.addOnItems[i].price / 100) * this.foodIncrement;
            this.addOnItems[i].price = +this.addOnItems[i].price + incrementV;
            let incrementV1 = (defaultaddOnItems[j].price / 100) * this.foodIncrement;
            defaultaddOnItems[j].price = +defaultaddOnItems[j].price + incrementV1;
          }
            this.seletedAddOnItems.push(this.addOnItems[i]);
            this.alreadydefaultSelectedOnItems.push(this.addOnItems[i]);
            defaultaddOnItems[j].checked1 = false; //  checkbox status true
            this.defaultSelectedOnItems.push(defaultaddOnItems[j]);

            for(var ii = 0; ii < this.cartSubItems.length; ii++) {

              // if(this.cartSubItems[ii].addon_id == this.addOnItems[i].sub_item_id) {
              //   this.addOnItems[i].checked = true;
              // }
              // console.log(this.alreadydefaultSelectedOnItems[j].sub_item_id,"index iiiiiii",this.cartSubItems[ii].addon_id);
              if(this.cartSubItems[ii].default && this.cartSubItems[ii].removed) {
                if(this.alreadydefaultSelectedOnItems[j].sub_item_id == this.cartSubItems[ii].addon_id) {
                  this.addOnItems[i].checked = false;
                  this.defaultSelectedOnItems.splice(j, 1);
                }
              }
              if(this.cartSubItems[ii].default && !this.cartSubItems[ii].extra && !this.cartSubItems[ii].removed) {
                if(this.alreadydefaultSelectedOnItems[j].sub_item_id == this.cartSubItems[ii].addon_id) {
                  this.addOnItems[i].checked = true;
                }
              }
              if(!this.cartSubItems[ii].default && this.cartSubItems[ii].extra && !this.cartSubItems[ii].removed) {
                if(this.alreadydefaultSelectedOnItems[j].sub_item_id == this.cartSubItems[ii].addon_id) {
                  defaultaddOnItems[j].checked1 = true;
                }
              }
            }
            //break;
          }else {//End if
          }
          // if we never find this.addOnItems[i].sub_item_id in this.defaultaddOnItems, the for loop will simply end,
          // and ismatch will remain false
        }
        // add this.addOnItems[i] to seletedAddOnItems only if we didn't find a match.
        if (!ismatch) {
            for(var ii = 0; ii < this.cartSubItems.length; ii++) {
              if(this.cartSubItems[ii].addon_id == this.addOnItems[i].sub_item_id) {
                this.addOnItems[i].checked = true;
                // break;
              }
                //this.addOnItems[i].checked = true;
              if(this.cartSubItems[ii].addon_id == this.addOnItems[i].sub_item_id) {
                if(!this.cartSubItems[ii].default && !this.cartSubItems[ii].removed) {
                  if(this.cartSubItems[ii].addon_name.includes('Extra') && this.cartSubItems[ii].extra ) {
                    //console.log(this.cartSubItems[ii].addon_id, "=====> ", this.addOnItems[i].sub_item_id);

                    this.addOnItems[i].checked1 = true;
                    this.defaultSelectedOnItems.push(this.addOnItems[i]);
                    break;
                  } else {
                    ///console.log(this.cartSubItems[ii].addon_id, "=====> ", this.addOnItems[i].sub_item_id);
                    this.defaultSelectedOnItems.push(this.addOnItems[i]);
                  }
                }
              }
            }
            this.defaultSelectedOnItems = _.uniq(this.defaultSelectedOnItems, function (item) {
              return item;
          });
          if(this.foodIncrement > 0) {
            let incrementV = (this.addOnItems[i].price / 100) * this.foodIncrement;
            this.addOnItems[i].price = +this.addOnItems[i].price + incrementV;
          }
          this.addOnItems[i].defaultchecked = false; 
          this.seletedAddOnItems.push(this.addOnItems[i]);
        } //End if
      }
    } else {
      this.is_default_addon_item = false;
      for (var i = 0; i < this.addOnItems.length; i++) {

        var ismatch = false; // we haven't found it yet
        // we have found this.addOnItems[i]] in this.defaultaddOnItems, so we can stop searching
        this.addOnItems[i].checked = false; 
        this.addOnItems[i].defaultchecked = false; 
        if(this.foodIncrement > 0) {
          let incrementV = (this.addOnItems[i].price / 100) * this.foodIncrement;
          this.addOnItems[i].price = +this.addOnItems[i].price + incrementV;
        }
        this.seletedAddOnItems.push(this.addOnItems[i]);
        break;
      }
    }

  }

  defaultItems(subItem, sub_item_id, index, event, subCat) {
    let length;
    // console.log("subCat", subCat);

    if(event.target.checked) {
      var chekedItems = this.getChekedItems() + 1;
      this.checkAddedItems(subCat, chekedItems, index);
        this.seletedAddOnItems[index].checked = true;
       // console.log(subItem)

        if(!this.seletedAddOnItems[index].defaultchecked){
         // this.foodIncrement
          this.foodItemPrices = +this.foodItemPrices + (parseInt(this.seletedAddOnItems[index]['price']) * this.qty);
        }
        if (this.seletedAddOnItems[index].sub_item_id == subItem.sub_item_id) {

          var selectedVariant = _.find(this.cartSubItems, function (item) { return (item.addon_id == subItem.sub_item_id && item.addon_name.includes("Extra")); });
          if(selectedVariant){
            subItem.checked1 = true;
            this.defaultSelectedOnItems.push(subItem);
          } else {
            this.defaultSelectedOnItems.push(subItem);
          }
          if(this.defaultSelectedOnItems.length > 0) {
            this.is_default_addon_item = true;
          }

        }else {
          subItem.checked1 = false; //  checkbox status true
          this.seletedAddOnItems[index].checked = true;;
          this.defaultSelectedOnItems.push(this.seletedAddOnItems[index]);
        //  break;
        }
      //}
    } else {
      var chekedItems = this.getChekedItems() - 1;
      this.checkAddedItems(subCat, chekedItems, index);
        if(!this.seletedAddOnItems[index].defaultchecked){
          this.foodItemPrices = this.foodItemPrices - (parseInt(this.seletedAddOnItems[index]['price']) * this.qty);
        }
        for (var j = 0; j < this.defaultSelectedOnItems.length; j++) {
          if (this.defaultSelectedOnItems[j] && (this.defaultSelectedOnItems[j].sub_item_id == subItem.sub_item_id)) {
            this.seletedAddOnItems[index].checked = false;;
            this.defaultSelectedOnItems[j].checked1 = false;;
            this.defaultSelectedOnItems[j].checked = false;;
            this.defaultSelectedOnItems.splice(j, 1);
            break;
          } else {
            
          }
        }
      }
      if(this.defaultSelectedOnItems.length == 0) {
        this.defaultSelectedOnItems = [];
      }
  }


  addExtraItems(subItem, price, index, event) {
    // console.log("subCat", subCat)
    // console.log("default_addon_item",)
    if(event.target.checked) {
      // var chekedItems = this.getChekedItems() + 1;
      // if(this.default_addon_item_bk) {
      //   this.checkAddedItems(this.default_addon_item_bk, chekedItems, index);
      // }
      this.defaultSelectedOnItems[index].checked1 = true;
      for (var j = 0; j < this.defaultSelectedOnItems.length; j++) {
        if (this.defaultSelectedOnItems[j] && (this.defaultSelectedOnItems[j].sub_item_id == subItem.sub_item_id)) {
          this.foodItemPrices = +this.foodItemPrices + (parseInt(this.defaultSelectedOnItems[j]['price']) * this.qty);
          break;
        }
      }
    } else {
      // var chekedItems = this.getChekedItems() - 1;
      // if(this.default_addon_item_bk) {
      //   this.checkAddedItems(this.default_addon_item_bk, chekedItems, index);
      // }      
      this.defaultSelectedOnItems[index].checked1 = false;
      for (var j = 0; j < this.defaultSelectedOnItems.length; j++) {
        if (this.defaultSelectedOnItems[j] && (this.defaultSelectedOnItems[j].sub_item_id == subItem.sub_item_id)) {
          this.foodItemPrices = +this.foodItemPrices - (parseInt(this.defaultSelectedOnItems[j]['price']) * this.qty);
          break;
        }
      }
    }
  }


  checkAddedItems(subCat, chekedItems, index) {
    if(subCat && subCat.multi_option == "custom") {
      if(chekedItems > subCat.multi_option_val) {
        setTimeout(() => this.toastr.error('Tyvärr, du kan bara välja '+subCat.multi_option_val+' Lägg till'), 1000);
        this.seletedAddOnItems[index].checked = false;
        this.enableButton = false;
        if(this.action == 'edit') {
          this.qty = this.item_qty;
        }else {
          this.qty = 1;
        }
        return this.callFoodItem(0);
      } else {
        this.enableButton = true;
      }
    }
    if(subCat && subCat.multi_option == "one") {
      if(chekedItems>1) {
        setTimeout(() => this.toastr.error('Tyvärr, du kan bara välja 1 Lägg till'), 1000);
        this.seletedAddOnItems[index].checked = false;
        this.enableButton = false;
        if(this.action == 'edit') {
          this.qty = this.item_qty;
        }else {
          this.qty = 1;
        }
        return this.callFoodItem(0);
      } else {
        this.enableButton = true;
      }
    }
  }


  getChekedItems() {
    //  console.log("this.defaultSelectedOnItems", this.defaultSelectedOnItems, "this.seletedAddOnItems", this.seletedAddOnItems);
    let seletedAddOnItems = this.seletedAddOnItems.filter((ch) => { return ch.checked }).map((ch) => { return ch });
    let defaultSelectedOnItems = this.defaultSelectedOnItems.filter((ch) => { return ch.checked1 }).map((ch) => { return ch });
    // console.log("defaulte",_.size(defaultSelectedOnItems))

      return (_.size(seletedAddOnItems) + _.size(defaultSelectedOnItems));
    // console.log("seletedAddOnItems", _.size(seletedAddOnItems), "defaultSelectedOnItems", defaultSelectedOnItems);
  }

  addToCartnew (price, action) {
    this.UsersService.addtoCart(this.item_id, this.merchantid, this.OriginalfoodItemPrices, this.qty, action, this.item_index, this.foodItemSize).subscribe(data => {
      if(data.code == 1) {
        this.activeModal.close('Modal Closed');
      } else {
        setTimeout(() => this.toastr.error('Fail', data.msg), 1000);
        // this.emptyMsg = data.msg;
      }
    });
  }

  addTocart(action) {
    //console.log("action===>", action);
    let addedItems= '';
    let addedNewItems= '';
    let defaultaddedItems= '';
    let cartItems = '';
    let removeDefaultItems = '';
    let alreadydefaultSelectedOnItems = this.alreadydefaultSelectedOnItems.filter((ch) => { return ch.checked }).map((ch) => { return ch });
    let seletedAddOnItems = this.seletedAddOnItems.filter((ch) => { return ch.checked }).map((ch) => { return ch });
    let defaultSelectedOnItems = this.defaultSelectedOnItems.filter((ch) => { return ch.checked1 }).map((ch) => { return ch });
    let defaultSelectedRemoveOnItems = this.alreadydefaultSelectedOnItems.filter((ch) => { return !ch.checked }).map((ch) => { return ch });

    // Finding remove default addons
    // var removedAddOnItems = this.alreadydefaultSelectedOnItems.filter(function (o) {
    //   return seletedAddOnItems.some(function (i) {
    //       return i.checked === o.checked;
    //   });
    // });

    var newlyAddedItems = seletedAddOnItems.filter(function(o1){
      // filter out (!) items in result2
      return !alreadydefaultSelectedOnItems.some(function(o2){
          return o1.sub_item_id === o2.sub_item_id;
      });
    });

    var seletedAddOnItems1 =alreadydefaultSelectedOnItems.filter(function(o1){
      // filter out (!) items in result2
      return seletedAddOnItems.some(function(o2){
          return o1.sub_item_id === o2.sub_item_id;
      });
    });

    let j = 0;

    for (;j < seletedAddOnItems1.length; j++) {
      let key ='sub_item[4]' + "[" +[j]+ "]";
      let value = "&addon_qty[4]"+ "[" +[j]+ "]"+"="+this.qty;
      let sub_item = seletedAddOnItems1[j].sub_item_id+"|0|"+seletedAddOnItems1[j].sub_item_name;
      // let sub_item = this.addOnItems[j].sub_item_id+"|"+this.addOnItems[j].price+"|"+this.addOnItems[j].sub_item_name+"|"+j+"||+"+this.addOnItems[j].sub_item_name
      addedItems += key + "="+sub_item+ value + "&";
    }

    for (let i = 0; i < newlyAddedItems.length; i++, j++) {
      let key ='sub_item[4]' + "[" +[j]+ "]";
      let value = "&addon_qty[4]"+ "[" +[j]+ "]"+"="+this.qty;
      let sub_item = newlyAddedItems[i].sub_item_id+"|"+newlyAddedItems[i].price+"|"+newlyAddedItems[i].sub_item_name+"|"+j+"||+"+newlyAddedItems[i].sub_item_name
      addedNewItems += key + "="+sub_item+ value + "&";
    }
    for (let i = 0; i < defaultSelectedOnItems.length; i++, j++) {
      let key ='sub_item[4]' + "[" +[j]+ "]";
      let value = "&addon_qty[4]"+ "[" +[j]+ "]"+"="+this.qty;
      let sub_item = defaultSelectedOnItems[i].sub_item_id+"|"+defaultSelectedOnItems[i].price+"|Extra "+defaultSelectedOnItems[i].sub_item_name+"|"+j+"||+Extra "+defaultSelectedOnItems[i].sub_item_name+"|Extra";
      defaultaddedItems += key + "="+ sub_item + value + "&";
    }
    //|||46|-Mozzarellaost
      for (let k = 0; k < defaultSelectedRemoveOnItems.length; k++, j++) {
        let key ='sub_item[4]' + "[" +[j]+ "]";
        // |||116|-Tomats%C3%A5s
        removeDefaultItems += key + "="+defaultSelectedRemoveOnItems[k].sub_item_id+"|||"+j+"|-"+defaultSelectedRemoveOnItems[k].sub_item_name + "&";
      }


    if(defaultaddedItems) {
      defaultaddedItems = "&" + defaultaddedItems;
    }
    if(removeDefaultItems) {
      removeDefaultItems = "&" + removeDefaultItems;
    }
    cartItems = addedItems + addedNewItems + defaultaddedItems + removeDefaultItems;
    cartItems = cartItems.replace(/&&/g,"&");
    this.UsersService.addtoCartAddon(this.item_index, action, this.item_id, this.merchantid, cartItems, this.OriginalfoodItemPrices, this.foodItemSize, this.qty).subscribe(data => {
      // console.log("after cart added*****", data);
      if(data) {
        this.activeModal.close('Modal Closed');
        this.alreadydefaultSelectedOnItems = [];
        this.seletedAddOnItems = [];
        this.defaultSelectedOnItems = [];
        // this.spinner.hide();
        //  setTimeout(() => this.toastr.success('Success', 'Food Item added to cart'), 0);
      } else {
        // this.emptyMsg = data.msg;
      }
    });
  }

  increaseValue(itemid, qty, price, index){

    this.qty+=1;
    var addOnAmt = 0;
    if(!this.disableAddOnItems) {
      var multiple = (this.OriginalfoodItemPrices) * this.qty;
      this.foodItemPrices = multiple;
      return false;
    }
    //this.foodItemPrices = 0
    let seletedAddOnItems = this.seletedAddOnItems.filter((ch) => { return ch.checked }).map((ch) => { return ch.price; });
    let defaultSelectedOnItems = this.defaultSelectedOnItems.filter((ch) => { return ch.checked1 }).map((ch) => { return ch.price });
    let alreadydefaultSelectedOnItems = this.alreadydefaultSelectedOnItems.filter((ch) => { return ch.checked }).map((ch) => { return ch.price });
    // console.log("selectedVariant", seletedAddOnItems);
    let alreadyDefaultItemsAmt = alreadydefaultSelectedOnItems.reduce((s, f) => {
        return s+ parseInt(f);// return the sum of the accumulator and the current time, as the the new accumulator
      }, 0);
    let defaultSelectedOnItemsAmt = defaultSelectedOnItems.reduce((s, f) => {
        return s+ parseInt(f);
      }, 0);
    let seletedAddOnItemsAmt = seletedAddOnItems.reduce((s, f) => {
          return s+ parseInt(f);
      }, 0);

    addOnAmt = (seletedAddOnItemsAmt + defaultSelectedOnItemsAmt) - alreadyDefaultItemsAmt;
    var multiple = (+this.OriginalfoodItemPrices+addOnAmt) * this.qty;
    // }
    this.foodItemPrices = multiple;
   //console.log("this.qty",this.qty,"amttaddOnAmttt===>", addOnAmt,"this.foodItemPrices",this.foodItemPrices)

  }

  omit_special_char(event)
  {   
     var k;  
     k = event.charCode;  //         k = event.keyCode;  (Both can be used)
     return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }

  decreaseValue(itemid, qty, price, index){

    //this.qty -= 1;
    if(this.qty == 0) {
      return false;
    }
    if(this.qty > 1) {
      if(!this.disableAddOnItems) {
       // if(this.qty)
        this.qty-=1;
        var multiple = (this.OriginalfoodItemPrices) * this.qty;
        this.foodItemPrices = multiple;
        return false;
      }
      var addOnAmt=0;
      let seletedAddOnItems = this.seletedAddOnItems.filter((ch) => { return ch.checked }).map((ch) => { return ch.price; });
      let defaultSelectedOnItems = this.defaultSelectedOnItems.filter((ch) => { return ch.checked1 }).map((ch) => { return ch.price });
      let alreadydefaultSelectedOnItems = this.alreadydefaultSelectedOnItems.filter((ch) => { return ch.checked }).map((ch) => { return ch.price });
      let alreadyDefaultItemsAmt = alreadydefaultSelectedOnItems.reduce((s, f) => {
          return s+ parseInt(f);
        }, 0);
      let defaultSelectedOnItemsAmt = defaultSelectedOnItems.reduce((s, f) => {
          return s+ parseInt(f);
        }, 0);
      let seletedAddOnItemsAmt = seletedAddOnItems.reduce((s, f) => {
            return s+ parseInt(f);
        }, 0);
      //var addOnAmt = (+this.OriginalfoodItemPrices + this.getSelectAMt());
      this.qty-=1;

      // if(this.action =="edit") {
      //   addOnAmt = 0;
      //  //addOnAmt = (seletedAddOnItemsAmt + defaultSelectedOnItemsAmt) - alreadyDefaultItemsAmt;

      //   var multiple = (+this.foodItemPrices+addOnAmt) * this.qty;
      //   var divide = multiple - (this.OriginalfoodItemPrices + addOnAmt);
      //   this.foodItemPrices = multiple;
      // }else {
        addOnAmt = (seletedAddOnItemsAmt + defaultSelectedOnItemsAmt) - alreadyDefaultItemsAmt;
        var multiple = (+this.OriginalfoodItemPrices+addOnAmt) * this.qty;
       // var divide = multiple - (this.OriginalfoodItemPrices + addOnAmt);
        this.foodItemPrices = multiple;
      //}

    }
  }

  getSelectAMt() {
    let seletedAddOnItems = this.seletedAddOnItems.filter((ch) => { return ch.checked }).map((ch) => { return ch.price; });
    let defaultSelectedOnItems = this.defaultSelectedOnItems.filter((ch) => { return ch.checked1 }).map((ch) => { return ch.price });
    let alreadydefaultSelectedOnItems = this.alreadydefaultSelectedOnItems.filter((ch) => { return ch.checked }).map((ch) => { return ch.price });
    let alreadyDefaultItemsAmt = alreadydefaultSelectedOnItems.reduce((s, f) => {
        return s+ parseInt(f);
      }, 0);
    let defaultSelectedOnItemsAmt = defaultSelectedOnItems.reduce((s, f) => {
        return s+ parseInt(f);
      }, 0);
    let seletedAddOnItemsAmt = seletedAddOnItems.reduce((s, f) => {
          return s+ parseInt(f);
      }, 0);
    return (seletedAddOnItemsAmt + defaultSelectedOnItemsAmt) - alreadyDefaultItemsAmt;

  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }


}
