import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HeaderService } from './header.service';
import { environment } from 'src/environments/environment';
import { interval } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  show=true;
  currentUrl: string;
  constructor(private activatedRoute:ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService, 
    private headerService: HeaderService, 
    public router: Router,
    private titleService: Title) {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(),800);
    // interval(5000 * 2).subscribe(x => {
    //   console.log("time interval");
    // });
   }
  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl = event.url;
      }
    });
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => this.titleService.setTitle(event['title']));
    localStorage.setItem("image_url", environment.image_url);
  }
}
