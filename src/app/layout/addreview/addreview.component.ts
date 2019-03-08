import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/core/services/users.service';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-addreview',
  templateUrl: './addreview.component.html',
  styleUrls: ['./addreview.component.css']
})
export class AddreviewComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private UsersService: UsersService,) { }


  ngOnInit() {
  }
  closeReview() {
    this.activeModal.close('Modal Closed');
  }
}
