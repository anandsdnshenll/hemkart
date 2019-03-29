import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-klarnainfo',
  templateUrl: './klarnainfo.component.html',
  styleUrls: ['./klarnainfo.component.css']
})
export class KlarnainfoComponent implements OnInit {
  @ViewChild("checkoutcontainer") MyContainer: ElementRef;
  showLoad = true;
  order_id: any;

  constructor(private user:UsersService, private routes: ActivatedRoute, private router: Router, private elementRef: ElementRef){ }

  ngOnInit() {
    this.ClearCart();
    this.user.checkoutKlarnaConfirmation().subscribe(data => {
      this.getSnippet(data);
    });
  }

  getSnippet(htmlSnippet) {
    this.MyContainer.nativeElement.innerHTML = htmlSnippet
    const scripts = <HTMLScriptElement[]>this.elementRef.nativeElement.getElementsByTagName('script');
    this.showLoad = false;
    const scriptsInitialLength = scripts.length;
    for (let i = 0; i < scriptsInitialLength; i++) {
      const script = scripts[i];
      const scriptCopy = <HTMLScriptElement>document.createElement('script');
      scriptCopy.type = script.type ? script.type : 'text/javascript';
      if (script.innerHTML) {
        scriptCopy.innerHTML = script.innerHTML;
      } else if (script.src) {
        scriptCopy.src = script.src;
      }
      scriptCopy.async = false;
      script.parentNode.replaceChild(scriptCopy, script);
    }
    this.getOrderId();
  }

  getOrderId() {
    this.user.getOrderId().subscribe(data => {
      this.order_id = data.details;
    });
  }

  ClearCart() {
    this.user.ClearCart().subscribe(data => {
    });
  }

  goSuccess() {
    this.router.navigate(['/success/'], { queryParams: { order_id: this.order_id } });
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("#navbar-left-brand-tab").hide();
      $(".showScrolledHeader").hide();
      $(".showFixedHeader").show();
    });
  }
}
