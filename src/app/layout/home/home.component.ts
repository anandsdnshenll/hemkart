import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UsersService } from 'src/app/core';
import { HeaderService } from 'src/app/header.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('input_geo_location') postalCodeDiv: ElementRef;
  screenHeight: any;
  screenWidth: any;
  searchs = false;
  cSearchForm: FormGroup;
  data:any;
  result:any;
  postalcode:any='';
  title="";


  constructor(private activeRoute:ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService, 
    private headerService:HeaderService,     
    private router: Router,
    private user:UsersService, ) {

    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(),800);
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('auth')
   }
   url:string;
  ngOnInit() {
    // this.headerService.setTitle('home');
    // const body = document.getElementsByTagName('body')[0];
    // body.classList.add('home_background');
  }

  ngOnDestroy(): void {
    // const body = document.getElementsByTagName('body')[0];
    // body.classList.remove('home_background');
  }

  onSearch() {
    this.searchs = true;
    this.spinnerService.show();
    if (this.cSearchForm.invalid) {
      setTimeout(() => this.spinnerService.hide(), 700);
      return;
    }
    else {
      setTimeout(() => this.spinnerService.hide(), 1000);
      this.router.navigate(['/products/'], { queryParams: { area: this.cSearchForm.value.search_address } });
    }

  }

  onGeoloc() {
    console.log("inside");
    this.spinnerService.show();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log("latitude=>", position.coords.latitude);
        // console.log("longitude=>", position.coords.longitude)
        this.user.getpcode(position.coords.latitude,position.coords.longitude).subscribe(data => {
          this.result = data;
          console.log(data);
          var str =this.result; 
          var n = parseInt(str.search("value"))+7;
          var z=str.search('"/>');
          var val=str.slice(n,85);
          this.postalcode=val;
          this.cSearchForm.controls['search_address'].setValue(val);
          this.postalCodeDiv.nativeElement.focus()
          setTimeout(() => this.spinnerService.hide(), 1500);
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
}
