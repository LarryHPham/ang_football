import {Component, Input, Output, ChangeDetectorRef, OnInit} from '@angular/core';
import { isBrowser } from 'angular2-universal';

@Component({
  selector: 'responsive-widget',
  templateUrl: './responsive-widget.component.html',
})

export class ResponsiveWidget implements OnInit {
  @Input() embedPlace: string;
  @Input() displayAtRes: string;
  @Input() scope: string;
  windowWidth: number = 10;
  widgetMed:boolean=false;
  widgetSml:boolean=false;

  ngOnInit() {
    this.displayAtRes = "_" + this.displayAtRes + "only";
    if (isBrowser) {
      var windowWidth = window.innerWidth;
      // var windowWidth = 960;
      if (windowWidth <= 1317) {
        this.widgetSml = true;
        this.widgetMed = false;
      }
      else {
          this.widgetSml = false;
          this.widgetMed = true;
      }
      this.windowWidth = windowWidth;
    }
  }
  private onWindowLoadOrResize(event) {
    var windowWidth = event.target.innerWidth;
    if ( windowWidth < 1317 ) {
      this.widgetSml = true;
      this.widgetMed = false;
    }
    else {
        this.widgetSml = false;
        this.widgetMed = true;
    }
    this.windowWidth = windowWidth;
  }
}
