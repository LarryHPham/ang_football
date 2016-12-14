import {Component, Input, OnInit} from '@angular/core';
import {Http, Headers} from '@angular/http';
import { GlobalSettings } from "../../../global/global-settings";

declare var jQuery:any;

@Component({
    selector: 'billboard-module',
    templateUrl: './app/fe-core/modules/billboard/billboard.module.html',
})

export class BillboardModule implements OnInit{
    isSmall:boolean = false;
    srcLink: string;
    @Input() category: string;
    @Input() subCategory: string;
    ngOnInit() {
      if(this.category){
        var topScope = GlobalSettings.getTCXscope(this.category).topScope;
        topScope = topScope != "real-estate" ? topScope : "real estate";
        this.category = topScope ? topScope : 'keyword-' + this.category;
        this.subCategory = this.subCategory && this.subCategory != this.category && this.category != "real estate" ? this.subCategory : "";
      } else {
        this.category = "breaking";
        this.subCategory = "";
      }
      this.srcLink = "/app/ads/billboard.html?category=" + this.category + "&sub_category=" + this.subCategory;
      this.isSmall = window.innerWidth <= 814;
    }

    onResize(event) {
      this.isSmall = event.target.innerWidth <= 814;
    }
}
