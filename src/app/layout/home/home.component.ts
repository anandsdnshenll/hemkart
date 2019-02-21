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
  color = 'primary';
  mode = 'determinate';
  value = 50;
  geoLoading = false;
  postalCodeField = true;
  input: any;
  postvalues: string;

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService, 
    private headerService: HeaderService,     
    private router: Router,
    private user: UsersService ) {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(),800);
   }
   url:string;

   ngOnInit() {
    this.cSearchForm = this.fb.group({
      search_address: ['', Validators.required],
      search_address_city: ['']
    });
    this.headerService.title.subscribe(title => {
      this.title = title;
    });
  }


  ngOnDestroy(): void {

  }

  onSearch() {
    this.searchs = true;
    this.spinnerService.show();
    if (this.cSearchForm.invalid) {
      setTimeout(() => this.spinnerService.hide(), 700);
      return;
    }
    else {
      this.input=this.cSearchForm.value.search_address;
      $('.cSearchInput').attr('value',this.cSearchForm.value.search_address);
      setTimeout(() => this.spinnerService.hide(), 1000);
      this.router.navigate(['/products/'], { queryParams: { area: this.cSearchForm.value.search_address } });
    }

  }

  removePostalCode(event:any) {
    if(event.target.value == "") {
      $('.cSearchInput').attr('value',"");
    }
  }

  onGeoloc() {
    this.spinnerService.show();
    this.geoLoading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.user.getpcode(position.coords.latitude,position.coords.longitude).subscribe(data => {
          this.result = data;
          this.geoLoading = false;
          var str =this.result; 
          var n = parseInt(str.search("value")) + 7;
          var z=str.search('"/>');
          var val=str.slice(n,85);
          this.postalcode=val;
          this.cSearchForm.controls['search_address'].setValue(val);
          $('.cSearchInput').attr('value',val);
          // this.postalCodeDiv.nativeElement.focus()
          setTimeout(() => this.spinnerService.hide(), 1500);
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
}
