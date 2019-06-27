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
  cityName = "";
  emptyValu: any;
  restaurantsName: any = [];
  restaurantsName1: any = [];
  lists: any = [];
  showRestaurants = true;
  showRestaurants1 = false;

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService, 
    private headerService: HeaderService,     
    private router: Router,
    private user: UsersService ) {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(),800);
    this.showRestCity("Västerås");
    this.clearWorkCompanyid();
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
    localStorage.setItem("isWorkorder","false")
  }

  showRestCity(cityName) {
    this.user.getCity(cityName).subscribe(data => {
      if(data.details) {
        // console.log("datatas*****", JSON.stringify(data.details));
        this.lists = data.details;
        this.restaurantsName = this.lists.list;
        localStorage.setItem("Västerås", this.restaurantsName);
        this.showRestaurants = true;
        this.showRestaurants1 = false;

      } else {
        this.emptyValu = data.msg;
      }
    });
  }

  clearWorkCompanyid() {
    this.user.clearWorkCompanyid().subscribe(data => {
    });
  }


  showRestCity1(cityName) {
    this.user.getCity(cityName).subscribe(data => {
      if(data.details) {
        // console.log("datatas*****", JSON.stringify(data.details));
        this.lists = data.details;
        this.restaurantsName1 = this.lists.list;
        localStorage.setItem("Eskilstuna", JSON.stringify(this.restaurantsName1));
        this.showRestaurants1 = true;
        this.showRestaurants = false;
      } else {
        this.emptyValu = data.msg;
      }
    });
  }

  ngOnDestroy(): void {

  }

  onSearch() {
    this.searchs = true;
    this.spinnerService.show();
    this.user.setPostalCode(this.cSearchForm.value.search_address);
    if (this.cSearchForm.invalid) {
      setTimeout(() => this.spinnerService.hide(), 700);
      return;
    }
    else {
      localStorage.setItem("postalCode", this.cSearchForm.value.search_address);
      this.input=this.cSearchForm.value.search_address;
      $('.cSearchInput').attr('value',this.cSearchForm.value.search_address);
      setTimeout(() => this.spinnerService.hide(), 1000);
      this.router.navigate(['/Restauranglista/']);
    }

  }

  removePostalCode(event:any) {
    if(event.target.value == "") {
      $('.cSearchInput').attr('value',"");
    }else{
      $('.cSearchInput').attr('value',event.target.value);
    }
  }

  onGeoloc() {
    this.spinnerService.show();
    this.geoLoading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.user.getLocation(position.coords.latitude, position.coords.longitude).subscribe(results => {
          this.geoLoading = false;
          setTimeout(() => this.spinnerService.hide(), 1500);
          for(var i=0;i<results.length;++i){
            if(results[i].types[0]=="postal_code"){
               this.postalcode = results[i].long_name;
            }
          }
          if (!this.postalcode) {
            //Postal Code Not found
          }else {
            localStorage.setItem("postalCode", this.postalcode);
            this.cSearchForm.controls['search_address'].setValue(this.postalcode);
            $('.cSearchInput').attr('value',this.postalcode);
             //Postal Code found
          }
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
  ngAfterViewInit() {
    $(document).ready(function () {

      $(".showScrolledHeader").show();
      $(".showFixedHeader").hide();
      // $(".showFixedHeader").css("background","red !important");
      // $(".showScrolledHeader").hide();
      // $(".showFixedHeader").show();

    });
  }


}
