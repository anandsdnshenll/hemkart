import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-infomodal',
  templateUrl: './infomodal.component.html',
  styleUrls: ['./infomodal.component.css']
})
export class InfomodalComponent implements OnInit {
  @Input() merchantid: number;
  @Input() type: string;
  availableTypes: string;
  operationOurs: any = [];
  productImage: any;
  api_url: string;

  constructor(private UsersService: UsersService, public activeModal: NgbActiveModal, ) { }

  ngOnInit() {
    this.productImage = JSON.parse(localStorage.getItem("restaurentDetail"))[0].productImage;
    this.availableTypes = JSON.parse(localStorage.getItem("restaurentDetail"))[0].availableTypes;

    this.api_url = localStorage.getItem("image_url");
  }

  ngAfterViewInit() {


    this.UsersService.GetOperationalHours(this.merchantid, this.type).subscribe(data=>{
      if(data.code == 1) {
        this.operationOurs = data.details
        //console.log("this.operationOurs", this.operationOurs);
      } else {
       // setTimeout(() => this.toastr.error('Fail', data.msg), 0);
      }
    });
  }
  
  closeModal() {
    this.activeModal.close('Modal Closed');
  }
}
