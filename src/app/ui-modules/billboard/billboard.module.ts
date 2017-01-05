import { Component, Input, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GlobalSettings } from "../../global/global-settings";
import { isBrowser } from 'angular2-universal';

@Component({
    selector: 'billboard-module',
    templateUrl: './billboard.module.html',
})

export class BillboardModule implements OnInit{
    isSmall:boolean = false;
    srcLink: string;
    @Input() subCategory: string;

    getData(){
      this.subCategory;
      this.srcLink = "app/ads/billboard.html?category=sports&sub_category=" + 'nfl';
    }

    ngOnInit() {
      if( isBrowser ){
        this.getData();
        this.isSmall = window.innerWidth <= 814;
      }
    }

    ngOnChanges(){
      this.getData();
    }

    onResize(event) {
      this.isSmall = event.target.innerWidth <= 814;
    }
}
