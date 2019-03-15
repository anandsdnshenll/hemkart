import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/core/services/users.service';
import { FormGroup } from '@angular/forms';
import * as _ from 'underscore';
import * as $ from 'jquery';

@Component({
  selector: 'app-listfood-modal',
  templateUrl: './listfood-modal.component.html',
  styleUrls: ['./listfood-modal.component.css']
})

export class ListfoodModal implements OnInit {
  @Input() itemId: number;
  @Input() merchantid: number;
  @Input() itemPrice: number;
  foodItem: any = [];
  addonForm: FormGroup;
  foodItemDetails: any = [];
  qty = 1;
  seletedAddOnItems: any = [];
  addOnItems: any = [];
  defaultaddOnItems: any = [];
  defaultSelectedOnItems: any = [];
  foodItemPrices: number;
  item_id: any;
  addedItems: any = [];
  foodItemSize: any;
  is_default_addon_item = true;
  alreadydefaultSelectedOnItems: any = [];

  constructor(public activeModal: NgbActiveModal, private UsersService: UsersService,) { 

  }

  ngOnInit() {
    // console.log("item id***", this.itemId);
  }

  ngAfterViewInit() {
    this.UsersService.GetFoodItem(this.itemId, this.merchantid).subscribe(data => {
      if(data.details) {
        this.item_id = data.details[0].item_id;
        this.foodItem = data.details[0];
        this.foodItemDetails = data.details[0].prices[0];
        this.foodItemPrices = data.details[0].prices[0].price;
        this.foodItemSize = data.details[0].prices[0].size;
        this.addOnItems = data.details[0].addon_item[0].sub_item;
        if(data.details[0].default_addon_item) {
          this.is_default_addon_item = true;
          this.defaultaddOnItems = data.details[0].default_addon_item[0].sub_item

          for (var i = 0; i < this.addOnItems.length; i++) {
            var ismatch = false; // we haven't found it yet
            for (var j = 0; j < this.defaultaddOnItems.length; j++) {
              if (this.addOnItems[i].sub_item_id == this.defaultaddOnItems[j].sub_item_id) {
                // we have found this.addOnItems[i]] in this.defaultaddOnItems, so we can stop searching
                ismatch = true;
                this.addOnItems[i].defaultchecked = true; //  checkbox status true
                this.addOnItems[i].checked = true; //  checkbox status true
                this.addOnItems[i].remove_sub_items = "|||"+i+"|-"+this.addOnItems[i].sub_item_name; //  concatenating items
                this.addOnItems[i].sub_items = this.addOnItems[i].sub_item_id+"|0|"+this.addOnItems[i].sub_item_name; //  concatenating items
                this.addOnItems[i].itemVal = this.addOnItems[i].sub_item_id+"|"+this.defaultaddOnItems[j].price+"|"+this.addOnItems[i].sub_item_name+"|"+i; //  concatenating items
                this.seletedAddOnItems.push(this.addOnItems[i]);
                this.alreadydefaultSelectedOnItems.push(this.addOnItems[i]);

                this.defaultaddOnItems[j].checked1 = false; //  checkbox status true
                this.defaultaddOnItems[j].remove_sub_items1 = ''; //  concatenating items
                this.defaultaddOnItems[j].sub_items1 = this.addOnItems[i].sub_item_id+"|"+this.addOnItems[i].price+"|Extra "+this.addOnItems[i].sub_item_name+"|"+i+"||+Extra "+this.addOnItems[i].sub_item_name; //  concatenating items
                this.defaultaddOnItems[j].itemVal1 = this.addOnItems[i].sub_item_id+"|"+ this.defaultaddOnItems[j].price+"|"+this.defaultaddOnItems[j].sub_item_name+"|"+i+"|||"+"+Extra"+this.defaultaddOnItems[j].sub_item_name; //  concatenating items
                this.defaultSelectedOnItems.push(this.defaultaddOnItems[j]);
                break;
              }//End if
              // if we never find this.addOnItems[i].sub_item_id in this.defaultaddOnItems, the for loop will simply end,
              // and ismatch will remain false
            }
            // add this.addOnItems[i] to seletedAddOnItems only if we didn't find a match.
            if (!ismatch) {
              this.addOnItems[i].checked = false; 
             this.addOnItems[i].remove_sub_items = ''; //  concatenating items
             this.addOnItems[i].sub_items = this.addOnItems[i].sub_item_id+"|"+this.addOnItems[i].price+"|"+this.addOnItems[i].sub_item_name+"|"+i+"||+"+this.addOnItems[i].sub_item_name; //  concatenating items
              this.addOnItems[i].itemVal = this.addOnItems[i].sub_item_id+"|"+this.addOnItems[i].price+"|"+this.addOnItems[i].sub_item_name+"|"+i+"||+"+this.addOnItems[i].sub_item_name; //  concatenating items
              this.seletedAddOnItems.push(this.addOnItems[i]);
            } //End if
          }
        } else {
          this.is_default_addon_item = false;
          for (var i = 0; i < this.addOnItems.length; i++) {
            var ismatch = false; // we haven't found it yet
            // we have found this.addOnItems[i]] in this.defaultaddOnItems, so we can stop searching
            this.addOnItems[i].checked = false; 
            this.addOnItems[i].remove_sub_items = "|||"+i+"|-"+this.addOnItems[i].sub_item_name; //  concatenating items
            this.addOnItems[i].sub_items = this.addOnItems[i].sub_item_id+"|0|"+this.addOnItems[i].sub_item_name; //  concatenating items
            this.addOnItems[i].itemVal = this.addOnItems[i].sub_item_id+"|"+this.addOnItems[i].price+"|"+this.addOnItems[i].sub_item_name+"|"+i; //  concatenating items
            this.seletedAddOnItems.push(this.addOnItems[i]);
            break;
          }
        }
      } else {
      }
    });
  }

  defaultItems(subItem, sub_item_id, index, event) {
    let length;
    if(event.target.checked) {
      this.seletedAddOnItems[index].checked = true;;
      this.foodItemPrices = +this.foodItemPrices + parseInt(this.seletedAddOnItems[index]['price']);
      for (var j = 0; j < this.defaultaddOnItems.length; j++) {
        if (this.defaultaddOnItems[j].sub_item_id == subItem.sub_item_id) {
          this.defaultSelectedOnItems.push(this.defaultaddOnItems[j]);
          break;
        }else {
          subItem.checked1 = false; //  checkbox status true
          subItem.remove_sub_items = ''; //  concatenating items
          this.seletedAddOnItems[index].checked = true;;
          subItem.sub_items = this.seletedAddOnItems[index].sub_item_id+"|"+this.seletedAddOnItems[index].price+"|Extra "+this.seletedAddOnItems[index].sub_item_name+"|"+length+"||+Extra "+this.seletedAddOnItems[index].sub_item_name; //  concatenating items
          subItem.itemVal = this.seletedAddOnItems[index].sub_item_id+"|"+ this.seletedAddOnItems[index].price+"|"+this.seletedAddOnItems[index].sub_item_name+"|"+length+"|||"+"+Extra"+this.seletedAddOnItems[index].sub_item_name; //  concatenating items
          this.defaultSelectedOnItems.push(subItem);
          break;
        }
      }
    } else {
      this.foodItemPrices = this.foodItemPrices - parseInt(this.seletedAddOnItems[index]['price']);
      for (var j = 0; j < this.defaultSelectedOnItems.length; j++) {
        if (this.defaultSelectedOnItems[j] && (this.defaultSelectedOnItems[j].sub_item_id == subItem.sub_item_id)) {
          this.seletedAddOnItems[index].checked = false;;
          this.defaultSelectedOnItems[j].checked1 = false;;
          this.defaultSelectedOnItems.indexOf(this.defaultSelectedOnItems);
          this.defaultSelectedOnItems.splice(j, 1);
          break;
      }
    }
  }
    if(this.defaultSelectedOnItems.length == 0) {
      this.defaultSelectedOnItems = [];
    }
  }

  addTocart() {
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
    var removedAddOnItems = this.alreadydefaultSelectedOnItems.filter(function (o) {
      return seletedAddOnItems.some(function (i) {
          return i.checked === o.checked;
      });
    });

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
      let value = "&addon_qty[4]"+ "[" +[j]+ "]"+"=1";
      let sub_item = seletedAddOnItems1[j].sub_item_id+"|0|"+seletedAddOnItems1[j].sub_item_name;
      // let sub_item = this.addOnItems[j].sub_item_id+"|"+this.addOnItems[j].price+"|"+this.addOnItems[j].sub_item_name+"|"+j+"||+"+this.addOnItems[j].sub_item_name
      addedItems += key + "="+sub_item+ value + "&";
    }

    for (let i = 0; i < newlyAddedItems.length; i++, j++) {
      let key ='sub_item[4]' + "[" +[j]+ "]";
      let value = "&addon_qty[4]"+ "[" +[j]+ "]"+"=1";
      let sub_item = newlyAddedItems[i].sub_item_id+"|"+newlyAddedItems[i].price+"|"+newlyAddedItems[i].sub_item_name+"|"+j+"||+"+newlyAddedItems[i].sub_item_name
      addedNewItems += key + "="+sub_item+ value + "&";
    }
    for (let i = 0; i < defaultSelectedOnItems.length; i++, j++) {
      let key ='sub_item[4]' + "[" +[j]+ "]";
      let value = "&addon_qty[4]"+ "[" +[j]+ "]"+"=1";
      let sub_item = defaultSelectedOnItems[i].sub_item_id+"|"+defaultSelectedOnItems[i].price+"|Extra "+defaultSelectedOnItems[i].sub_item_name+"|"+j+"||+Extra "+defaultSelectedOnItems[i].sub_item_name;
      defaultaddedItems += key + "="+ sub_item + value + "&";
    }

      for (let k = 0; k < defaultSelectedRemoveOnItems.length; k++, j++) {
        let key ='sub_item[4]' + "[" +[j]+ "]";
        // |||116|-Tomats%C3%A5s
        removeDefaultItems += key + "="+"|||"+[j]+"|-"+defaultSelectedRemoveOnItems[k].sub_item_name + "&";
      }


    if(defaultaddedItems) {
      defaultaddedItems = "&" + defaultaddedItems;
    }
    if(removeDefaultItems) {
      removeDefaultItems = "&" + removeDefaultItems;
    }
    cartItems = addedItems + addedNewItems + defaultaddedItems + removeDefaultItems;
    cartItems = cartItems.replace(/&&/g,"&");

    this.UsersService.addtoCartAddon(this.item_id, this.merchantid, cartItems, this.foodItemPrices, this.foodItemSize).subscribe(data => {
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

  addExtraItems(subItem, price, index, event) {
    if(event.target.checked) {
      this.defaultSelectedOnItems[index].checked1 = true;
      for (var j = 0; j < this.defaultSelectedOnItems.length; j++) {
        if (this.defaultSelectedOnItems[j] && (this.defaultSelectedOnItems[j].sub_item_id == subItem.sub_item_id)) {
          this.foodItemPrices = +this.foodItemPrices + parseInt(this.defaultSelectedOnItems[j]['price']);
          break;
        }
      }
    } else {
      this.defaultSelectedOnItems[index].checked1 = false;
      for (var j = 0; j < this.defaultSelectedOnItems.length; j++) {
        if (this.defaultSelectedOnItems[j] && (this.defaultSelectedOnItems[j].sub_item_id == subItem.sub_item_id)) {
          this.foodItemPrices = +this.foodItemPrices - parseInt(this.defaultSelectedOnItems[j]['price']);
          break;
        }
      }
    }
  }

  increaseValue(itemid, qty, price, index){
    // console.log('index', index);
    this.UsersService.updateCart(itemid, this.merchantid, parseInt(qty) + 1, price, parseInt(index)+1 ).subscribe(data => {
      if(data.code == 1) {
        // this.loadCart(this.merchantid);
      } else {
        // setTimeout(() => this.toastr.success('Fail', data.msg), 0);
      }
    });
  }

  decreaseValue(itemid, qty, price, index){
    let seletedqty = parseInt(qty)-1;
    if(seletedqty == 0) {
      // this.deleteCart(index)
    } else {
      this.UsersService.updateCart(itemid, this.merchantid, seletedqty, price, parseInt(index)+1).subscribe(data => {
        if(data.code == 1) {
          // this.loadCart(this.merchantid);
        } else {
          // setTimeout(() => this.toastr.success('Fail', data.msg), 0);
        }
        // this.loadCart(this.merchantid);
        // console.log("after cart updated*****", data);
      });
    }

  }
  closeModal() {
    this.activeModal.close('Modal Closed');
  }


}
