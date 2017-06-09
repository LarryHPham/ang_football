import {Component, Input, OnInit} from '@angular/core';
import {isBrowser} from 'angular2-universal';

@Component({
  selector: 'responsive-widget',
  templateUrl: './responsive-widget.component.html',
})

export class ResponsiveWidget implements OnInit {
  @Input() embedPlace: string;
  @Input() scope: string;
  @Input() deepDive: boolean = false;
  @Input() pageType: string;
  public displayAtRes: string;
  widthLimit: number;
  windowWidth: number = 10;
  widgetMed: boolean = false;
  widgetSml: boolean = false;

  ngOnInit() {
    if (isBrowser) {
      var windowWidth = window.innerWidth;
      this.getWidgetParams(this.pageType, windowWidth);
    }
  }

  private onWindowLoadOrResize(event) {
    var windowWidth = event.target.innerWidth;
    this.getWidgetParams(this.pageType, windowWidth);
  }

  getWidgetParams(type, width) {
    switch (type) {
      case "deepDive":
      case "article":
        this.displayAtRes = "_1280only";
        this.widthLimit = 1280;
        break;
      case "profile":
        this.displayAtRes = "_1024only";
        this.widthLimit = 992;
        break;
      default:
        this.displayAtRes = "_1024only";
        this.widthLimit = 992;
    }
    if (this.deepDive) {
      if (width <= this.widthLimit) {
        this.widgetSml = true;
        this.widgetMed = false;
      }
    } else {
      if (width < this.widthLimit && width >= 670) {
        this.widgetSml = false;
        this.widgetMed = true;
      } else if (width < 670) {
        this.widgetSml = true;
        this.widgetMed = false;
      } else {
        this.widgetSml = false;
        this.widgetMed = false;
      }
    }
    this.windowWidth = width;
  }
}
