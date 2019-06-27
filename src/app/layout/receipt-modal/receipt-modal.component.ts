import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-receipt-modal',
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['./receipt-modal.component.css']
})
export class ReceiptModalComponent implements OnInit {
  @Input() order_id: number;
  @Input() totalOrder: number;
  orderDetails: any = [];
  orderInfo: any = [];
  customerInfo: any = [];
  otherdetails: any = [];
  orderItems: any = [];
  orderTotal: any = [];

  constructor(private user: UsersService, public activeModal: NgbActiveModal, ) { }

  ngOnInit() {
    this.user.getReciept(this.order_id).subscribe(data => {
      if(data.code == 1) {
        // this.enableOrderInfo = true;
        this.orderDetails = data.details;
        this.orderInfo = this.orderDetails.order_info;
        this.customerInfo = this.orderInfo.customer_info;
        this.otherdetails = this.orderDetails.raw;
        this.orderItems = this.otherdetails.item;
        this.orderTotal = this.otherdetails.total;
        //this.user.callConfirmation(this.order_id);

      }
    });
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }
}
