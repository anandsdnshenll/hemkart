import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, Route,ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { UsersService } from 'src/app/core';
import { HeaderService } from 'src/app/header.service';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  screenHeight: any;
  screenWidth: any;
  searchs = false;
  cSearchForm: FormGroup;
  data:any;
  result:any;
  postalcode:any='';
  title="";
  userName: string;
  constructor(
    private fb: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private router: Router,
    private user:UsersService,
    private activeRoute:ActivatedRoute,
    private headerService:HeaderService
  ) {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(),800);
    this.userName = localStorage.getItem("userName") ? localStorage.getItem("userName") : "";
 
  }
  ngOnInit() {
    // this.cSearchForm = this.fb.group({
    //   search_address: ['', Validators.required],
    //   search_address_city: ['']
    // });
    // this.headerService.title.subscribe(title => {
    //   this.title = title;
    //   console.log(title);
    // });
    // console.log("header",this.activeRoute);
    // console.log(this.activeRoute.snapshot['_routerState'].url); 
  }
  // onSearch() {
  //   // this.router.navigate(['team', 33, 'user', 11], {relativeTo: route});
  //   this.searchs = true;
  //   this.spinnerService.show();
  //   console.log(this.cSearchForm);
  //   if (this.cSearchForm.invalid) {
  //     setTimeout(() => this.spinnerService.hide(), 700);
  //     return;
  //   }
  //   else {
  //     setTimeout(() => this.spinnerService.hide(), 1000);
  //     console.log(this.cSearchForm.value);
  //     this.router.navigate(['/products/'], { queryParams: { area: this.cSearchForm.value.search_address } });
  //   }

  // }
  // onGeoloc() {
  //   this.spinnerService.show();
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       console.log("latitude=>", position.coords.latitude);
  //       console.log("longitude=>", position.coords.longitude)
  //       this.user.getpcode(position.coords.latitude,position.coords.longitude).subscribe(data => {
  //         this.result = data;
  //         console.log(data);
  //         var str =this.result; 
  //         var n = parseInt(str.search("value"))+7;
  //         var z=str.search('"/>');
  //         //console.log(this.result,"n=>",n,"end=>",z)
  //         console.log(str.slice(n,85));
  //         var val=str.slice(n,85);
  //         this.postalcode=val;
  //         this.cSearchForm.get('search_address').setValue(val);
  //         setTimeout(() => this.spinnerService.hide(), 1500);
  //         //this.valu();
  //       });
  //     });
  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // }
  
  ngAfterViewInit() {
   
  }

}
