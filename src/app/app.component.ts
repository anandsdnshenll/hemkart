import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HeaderService } from './header.service';
import { environment } from 'src/environments/environment';
import { interval } from 'rxjs';


declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  show=true;
  currentUrl: string;
  constructor(private activeRoute:ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService, 
    private headerService: HeaderService, 
    public router: Router) {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(),800);
    // interval(5000 * 2).subscribe(x => {
    //   console.log("time interval");
    // });
   }
  title = 'hemkart';

  ngOnInit() {
    this.headerService.title.subscribe(title => {
      this.title = title;
    });
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl = event.url;
      }
    });
    localStorage.setItem("image_url", environment.image_url);
  }
}
