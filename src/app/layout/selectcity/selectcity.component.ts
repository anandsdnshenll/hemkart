import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/core';
import { ToastrService } from 'ngx-toastr';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'app-selectcity',
  templateUrl: './selectcity.component.html',
  styleUrls: ['./selectcity.component.css']
})
export class SelectcityComponent implements OnInit {
  // @ViewChild(MatSelect) selectAdd: MatSelect;
  @ViewChild('selectAdd') selectAdd: ElementRef;
  selectCity: any;
  companyDetails: any = [];
  selectedImage: any;
  validMsg: any;
  selectedAddress: number;
  cityDetails: any = [];
  emptyCity = false;
  noCity: any;
  image_url: string;
  showCompAddress = false;
  emptyAddress: string;

  constructor(public activeModal: NgbActiveModal, private UsersService: UsersService, private toastr: ToastrService, ) { }

  ngOnInit() {
    this.image_url = localStorage.getItem("image_url");
    this.getWorkCity();
  }

  

  getWorkCity() {
    this.UsersService.getWorkCity().subscribe(data => {
      if(data.code == 1) {
        this.cityDetails = data.details;
        this.emptyCity = false;
      }else{
        this.emptyCity = true;
        this.noCity = data.msg
        setTimeout(() => this.toastr.error(data.msg), 1000);
      }
    });
  }

  getCity(city, index) {
    this.selectedImage = index;
    this.selectCity = city;
    this.UsersService.getCompany(city).subscribe(data => {
      if(data.code == 1) {
        this.companyDetails = data.details;
        if(this.companyDetails.length > 0) {
          this.showCompAddress = true;
        }else {
          this.showCompAddress = false;
        }
      }
    });
  }

  submit() {
    if(!this.selectCity) {
      this.validMsg = "vänligen välj atlease en stad";
      return false;
    }
    if(this.selectedAddress == undefined) {
      this.emptyAddress = "plese välj minst en adress";
      this.selectAdd.nativeElement.focus();
      return false;
    }
    this.UsersService.setWorkCompanyid(this.selectedAddress).subscribe(data => {
      if(data.code == 1) {
        var selectedVal = {
          selectCity: this.selectCity,
          selectedAddress: this.selectedAddress
        }
        this.activeModal.close(selectedVal);
      } else {
        setTimeout(() => this.toastr.error(data.msg), 1000);
      }
    });
  }

  closeModel() {
    this.activeModal.close();
  }
}
