import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-postcodemodal',
  templateUrl: './postcodemodal.component.html',
  styleUrls: ['./postcodemodal.component.css']
})

export class PostcodemodalComponent implements OnInit {
  @Input() merchantid: number;
  postCodes: any = [];
  postNumber: any;

  constructor(private UsersService: UsersService, public activeModal: NgbActiveModal, ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.UsersService.merchantPostCodes(this.merchantid).subscribe(data=>{
      if(data.code == 1) {
        this.postCodes = data.details;
        if(localStorage.getItem("postalCode")) {
          this.postNumber = localStorage.getItem("postalCode");
        } else {
          this.postNumber = this.postCodes[0];
        }

      //  console.log("this.postCodes", this.postCodes);
      } else {
       // setTimeout(() => this.toastr.error('Fail', data.msg), 0);
      }
    });
  }

  setPostal() {
    this.UsersService.setZipcode(this.postNumber).subscribe(data => {
      localStorage.setItem("postalCode", this.postNumber)
      this.activeModal.close('Modal Closed');
    });
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }
}
