import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, Route } from '@angular/router';
import { HeaderService } from 'src/app/header.service';
import { UsersService } from 'src/app/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private spinnerService: Ng4LoadingSpinnerService, private headerService: HeaderService, private router: Router, private user: UsersService) {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(),600);
  }
  ngOnInit() {
    this.headerService.setTitle('landing');
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('home_background');
    this.clearWorkCompanyid();
  }

  ngOnDestroy(): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('home_background');
  }
  homePage(page) {
    this.router.navigateByUrl(page);
  }
  clearWorkCompanyid() {
    this.user.clearWorkCompanyid().subscribe(data => {
    });
  }
}

