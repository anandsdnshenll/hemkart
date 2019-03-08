import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/core/services/users.service';
import { FormGroup } from '@angular/forms';

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

  constructor(public activeModal: NgbActiveModal, private UsersService: UsersService,) { 

  }

  ngOnInit() {
    console.log("item id***", this.itemId);

  }

  ngAfterViewInit() {
    this.UsersService.GetFoodItem(this.itemId, this.merchantid).subscribe(data => {
      if(data.details) {
        // console.log("food items*****", JSON.stringify(data));
        this.foodItem = data.details[0];
        console.log("food items*****",this.foodItem.item_name);

      } else {
      }
    });
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }


}
