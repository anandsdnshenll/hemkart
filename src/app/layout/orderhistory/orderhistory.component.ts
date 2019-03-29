import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReceiptModalComponent } from '../receipt-modal/receipt-modal.component';

@Component({
  selector: 'app-orderhistory',
  templateUrl: './orderhistory.component.html',
  styleUrls: ['./orderhistory.component.css']
})
export class OrderhistoryComponent implements OnInit {
  orderHistory: any;
  emptyValu: any;
  loading = true;

  constructor(private user:UsersService, private routes: ActivatedRoute, private router: Router, private modalService: NgbModal,) { 

  }

  ngOnInit() {
    this.loading = true;
    this.user.orderHistory().subscribe(data => {
      if(data.code == 1) {
        this.orderHistory = data.details;
        this.loading = false;
      } else {
        this.emptyValu = data.msg;
      }
    });
    
  }

  getReceipt(order_id, totalOrder) {
    const modalRef = this.modalService.open(ReceiptModalComponent);
    modalRef.componentInstance.order_id = order_id;
    modalRef.componentInstance.totalOrder = this.orderHistory.length;
    modalRef.result.then((result) => {
      
    }).catch((error) => {
      console.log(error);
    });
  }

  ngAfterViewInit() {

    $(document).ready(function () {
      
      $(".navbar-left-brand").hide();
      $(".showScrolledHeader").hide();
      $(".showFixedHeader").show();


    });
  }
}
